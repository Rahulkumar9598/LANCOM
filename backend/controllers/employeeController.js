import Employee from '../models/employeeModel.js';
import Department from '../models/Department.js';

export const addEmployee = async (req, res) => {
  try {
    const departmentId = req.department._id;
    const { name, email, role, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    // Ensure the employee is being added to the same department as the requester
    const employee = new Employee({
      name,
      email,
      role: role || 'employee',
      password,
      department: departmentId,
    });
    await employee.save();
    return res.status(201).json({ success: true, employee });
  } catch (error) {
    console.error('Add employee error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
export const getEmployees = async (req, res) => {
  try {
    const departmentId = req.department._id;
    const employees = await Employee.find({ department: departmentId }).select('-password');
    return res.json({ success: true, employees });
  } catch (error) {
    console.error('Get employees error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
