import Task from '../models/Task.js';
import Department from '../models/Department.js';

export const createTask = async (req, res) => {
  try {
    const {title , departmentId ,createdAt ,status ,assignedTo ,createdBy ,description  } = req.body;

    console.log(req.body, "this is my request body");

    // Validate required fields
    if (!title || !createdBy || !assignedTo ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, createdBy, assignedTo'
      });
    }

    let createdByDept, assignedToDept;

    // If departmentId is provided, use it for createdBy
    if (departmentId) {
      createdByDept = await Department.findById(departmentId);
      if (!createdByDept) {
        return res.status(404).json({
          success: false,
          message: `Department with ID '${departmentId}' not found`
        });
      }
    }

    // Handle createdBy - try multiple ways
    if (!createdByDept && createdBy) {
      // Try to find by ID first
      if (createdBy.match(/^[0-9a-fA-F]{24}$/)) {
        createdByDept = await Department.findById(createdBy);
      }
      
      // If not found, try by department name (case insensitive)
      if (!createdByDept) {
        createdByDept = await Department.findOne({ 
          department: { $regex: new RegExp(`^${createdBy}$`, 'i') } 
        });
      }
    }

    // Handle assignedTo
    if (assignedTo) {
      // Try to find by ID first
      if (assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
        assignedToDept = await Department.findById(assignedTo);
      }
      
      // If not found, try by department name (case insensitive)
      if (!assignedToDept) {
        assignedToDept = await Department.findOne({ 
          department: { $regex: new RegExp(`^${assignedTo}$`, 'i') } 
        });
      }
    }

    // If still not found, check all available departments
    if (!createdByDept) {
      const availableDepts = await Department.find({}, 'department');
      const deptNames = availableDepts.map(d => d.department).join(', ');
      
      return res.status(404).json({
        success: false,
        message: `Department '${createdBy}' not found. Available departments: ${deptNames}`,
        availableDepartments: availableDepts.map(d => d.department)
      });
    }

    if (!assignedToDept) {
      const availableDepts = await Department.find({}, 'department');
      const deptNames = availableDepts.map(d => d.department).join(', ');
      
      return res.status(404).json({
        success: false,
        message: `Department '${assignedTo}' not found. Available departments: ${deptNames}`,
        availableDepartments: availableDepts.map(d => d.department)
      });
    }

    // Create new task with ObjectIds
    const newTask = new Task({
      title: title.trim(),
      description: description || '',
      createdBy: createdByDept._id,
      assignedTo: assignedToDept._id,
      status: status || 'pending',
      // priority: priority || 'medium',
      // dueDate: new Date(dueDate)
    });

    // Save task to database
    const savedTask = await newTask.save();

    // Populate department details for response
    const populatedTask = await Task.findById(savedTask._id)
      .populate('createdBy', 'department email phone headName')
      .populate('assignedTo', 'department email phone headName');

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });

  } catch (error) {
    console.error(error, "error from createTask");
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate task found'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating task',
      error: error.message
    });
  }
};

export const getTasksAssignedToMe = async (req, res) => {
  try {
    if (!req.department || !req.department._id) {
      return res.status(400).json({
        success: false,
        message: 'Department not found in request'
      });
    }

    const tasks = await Task.find({
      assignedTo: req.department._id
    })
      .populate('createdBy', 'department email headName')
      .populate('assignedTo', 'department email headName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Error fetching assigned tasks:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


export const getTasksCreatedByMe = async (req, res) => {
  try {
    // Safety check
    if (!req.department || !req.department._id) {
      return res.status(400).json({
        success: false,
        message: 'Department not found in request'
      });
    }

    const tasks = await Task.find({
      createdBy: req.department._id
    })
      .populate('createdBy', 'department email headName')
      .populate('assignedTo', 'department email headName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Error fetching created tasks:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get tasks by specific date
export const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Get all tasks created on this date (no department filter)
    const tasks = await Task.find({
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          date
        ]
      }
    })
    .populate('createdBy', 'department email phone headName')
    .populate('assignedTo', 'department email phone headName')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks for this date"
    });
  }
};

export const markCompleteTask = async (req, res) => {
  try {
    const { taskId } = req.body; 
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check authorization - only assigned department can complete
    if (task.assignedTo.toString() !== req.department._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this task' });
    }
    
    // Prevent re-completing already completed tasks
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task is already completed' });
    }
    
    // Update task
    task.status = 'completed';
    task.completedAt = new Date();
    
    await task.save();
    
    const updatedTask = await Task.findById(taskId)
      .populate('createdBy', 'department email phone headName status')
      .populate('assignedTo', 'department email phone headName status');
    
     return res.status(200).json({ 
      success: true, 
      message: 'Task marked as completed successfully',
      task: updatedTask 
    });


  } catch (error) {
    console.error('Error in markCompleteTask:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const handleGetAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find({}, 'department');
    
    if (!departments || departments.length === 0) {
      return res.status(400).json({
        message: "Departments not found",
        success: false
      });
    }

    // Sirf department names ka array nikalna hai
    const departmentNames = departments.map(dept => dept.department);

    return res.status(200).json({
      message: "Departments fetched successfully",
      success: true,
      data: departmentNames  // ['ADMIN', 'IT', 'HR', ...]
    });
    
  } catch (error) {
    console.log(error, "error from handleGetAllDepartment");
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.createdBy.toString() !== req.department._id.toString()) {
      return res.status(403).json({ message: 'Only task creator can delete' });
    }
    
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

