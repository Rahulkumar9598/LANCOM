
// import React, { useMemo, useState, useEffect, useRef } from "react";
// import {
//   Search,
//   ChevronDown,
//   CheckCircle,
//   AlertCircle,
//   Box,
//   ShoppingCart,
//   Users,
//   Server,
//   BarChart3,
//   Settings,
//   Layers,
//   Activity,
//   Circle,
//   Calendar as CalendarIcon,
//   X,
//   Flag,
//   Eye,
//   Plus,
//   AlertTriangle,
//   Building2,
// } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import { LogOut } from 'lucide-react';
// import ConstantApi from "../../services/endpoints.js";
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from "react-toastify";
// import API from "../../services/axiosConfig.js";
// import { logout } from "../../store/authSlice.js";

// const Dashboard = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedDept, setSelectedDept] = useState("admin");
//   const [search, setSearch] = useState("");
//   const [toggleView, setToggleView] = useState(0);
//   const navigate = useNavigate()
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [tasksAssignedToMe, setTasksAssignedToMe] = useState([]);
//   const [tasksICreated, setTasksICreated] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // State for dynamic departments from backend
//   const [allDepartments, setAllDepartments] = useState([]);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [showAllDepartments, setShowAllDepartments] = useState(false);

//   // New state for selected date tasks
//   const [selectedDateTasks, setSelectedDateTasks] = useState([]);
//   const [dateLoading, setDateLoading] = useState(false);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  
//   // State to store random icons for new departments
//   const [randomDepartmentIcons, setRandomDepartmentIcons] = useState({});

//   const department = useSelector(state => state.auth)

//   console.log(department, " this is my department")

//   const loggedInDepartment = department?.department?.department || "ADMIN";
//   const dispatch = useDispatch();
//   const dropdownRef = useRef(null);

//   // Array of available icons for random assignment
//   const availableIcons = [
//     CheckCircle, Box, Layers, ShoppingCart, BarChart3, 
//     Server, Users, Settings, Activity, Building2, AlertCircle, Flag
//   ];

//   // Function to get random icon
//   const getRandomIcon = () => {
//     return availableIcons[Math.floor(Math.random() * availableIcons.length)];
//   };

//   // Store random icons for new departments
//   useEffect(() => {
//     if (allDepartments.length > 0) {
//       const iconMap = {
//         'QC': CheckCircle,
//         'PRDN': Box,
//         'DESIGN': Layers,
//         'STORE': ShoppingCart,
//         'PRCHS': BarChart3,
//         'AC': BarChart3,
//         'IT': Server,
//         'SALES': Users,
//         'ADMIN': Settings,
//         'MNTNS': Activity,
//         'admin': Settings,
//         'it': Server,
//         'design': Layers,
//         'sales': Users,
//         'store': ShoppingCart,
//         'qc': CheckCircle,
//         'prdns': Box,
//         'prchs': BarChart3,
//         'ac': BarChart3,
//         'mntns': Activity,
//       };

//       const newIcons = { ...randomDepartmentIcons };
//       allDepartments.forEach(deptName => {
//         const upperDept = deptName.toUpperCase();
//         // If department doesn't have a predefined icon and no random icon yet, assign one
//         if (!iconMap[upperDept] && !newIcons[upperDept]) {
//           newIcons[upperDept] = getRandomIcon();
//         }
//       });
//       setRandomDepartmentIcons(newIcons);
//     }
//   }, [allDepartments]);

//   // Fetch departments from backend
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         setLoadingDepartments(true);
//         const res = await API.post(ConstantApi.task.getAllDepartment);
//         console.log(res, " this is my response ");
        
//         // Extract departments from response
//         if (res.data && res.data.data) {
//           setAllDepartments(res.data.data);
//         }
//       } catch (error) {
//         console.log(error, " this is my response fetchDepartment");
//       } finally {
//         setLoadingDepartments(false);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Dynamic departments with icons mapping
//   const departments = useMemo(() => {
//     // Icon mapping for departments
//     const iconMap = {
//       'QC': CheckCircle,
//       'PRDN': Box,
//       'DESIGN': Layers,
//       'STORE': ShoppingCart,
//       'PRCHS': BarChart3,
//       'AC': BarChart3,
//       'IT': Server,
//       'SALES': Users,
//       'ADMIN': Settings,
//       'MNTNS': Activity,
//       'admin': Settings,
//       'it': Server,
//       'design': Layers,
//       'sales': Users,
//       'store': ShoppingCart,
//       'qc': CheckCircle,
//       'prdns': Box,
//       'prchs': BarChart3,
//       'ac': BarChart3,
//       'mntns': Activity,
//     };
    
//     // If backend data is loaded, use it
//     if (allDepartments.length > 0) {
//       return allDepartments.map(deptName => {
//         const upperDept = deptName.toUpperCase();
//         // Use predefined icon if exists, otherwise use the random assigned icon
//         const icon = iconMap[upperDept] || randomDepartmentIcons[upperDept] || Building2;
//         return {
//           name: upperDept,
//           icon: icon
//         };
//       });
//     }
    
//     // Fallback to static departments while loading or if no data
//     return [
//       { name: "QC", icon: CheckCircle },
//       { name: "PRDN", icon: Box },
//       { name: "DESIGN", icon: Layers },
//       { name: "STORE", icon: ShoppingCart },
//       { name: "PRCHS", icon: BarChart3 },
//       { name: "AC", icon: BarChart3 },
//       { name: "IT", icon: Server },
//       { name: "SALES", icon: Users },
//       { name: "ADMIN", icon: Settings },
//       { name: "MNTNS", icon: Activity },
//     ];
//   }, [allDepartments, randomDepartmentIcons]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   const MarkCompleteTask = async (taskId) => {
//     try {
//       console.log(taskId, " this i smy task id")
//       const res = await API.post(ConstantApi.task.markCompleteTask, { taskId })
//       console.log(res, " this is my response ")

//       if (res.data.success) {
//         toast.success(res?.data?.message || "Task completed successfully")
//       }

//     } catch (error) {
//       console.log(error, " error from markCompleteTask")
//     }
//   }

//   const getTasksAssignedToMe = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get(ConstantApi.task.getTasksAssignedToMe);
//       console.log(res, "this is my response of fetch task");

//       if (res.data.success && res.data.tasks) {
//         const formattedTasks = res.data.tasks.map(task => ({
//           _id: task._id,
//           title: task.title,
//           description: task.description,
//           createdBy: task.createdBy?.department || "Unknown",
//           assignedTo: task.assignedTo?.department || "Unknown",
//           status: task.status,
//           priority: task.priority,
//           dueDate: task.dueDate?.split('T')[0] || task.dueDate,
//           createdAt: task.createdAt?.split('T')[0] || task.createdAt,
//           comments: task.comments || 0,
//           attachments: task.attachments || 0,
//         }));
//         setTasksAssignedToMe(formattedTasks)
//       }
//     } catch (error) {
//       console.log(error?.response, "error from fetchtask");
//       toast.error(error?.response?.data?.message || "Error fetching tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTasksCreatedByMe = async () => {
//     try {
//       const res = await API.get(ConstantApi.task.getTasksCreatedByMe);
//       if (res.data.success && res.data.tasks) {
//         const formattedTasks = res.data.tasks.map(task => ({
//           _id: task._id,
//           title: task.title,
//           description: task.description,
//           createdBy: task.createdBy?.department || "Unknown",
//           assignedTo: task.assignedTo?.department || "Unknown",
//           status: task.status,
//           priority: task.priority,
//           dueDate: task.dueDate?.split('T')[0] || task.dueDate,
//           createdAt: task.createdAt?.split('T')[0] || task.createdAt,
//         }));
//         setTasksICreated(formattedTasks);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // New function to fetch tasks by date
//   const fetchTasksByDate = async (date) => {
//     try {
//       setDateLoading(true);
//       // Use local date instead of UTC to avoid timezone issues
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       const formattedDate = `${year}-${month}-${day}`;

//       const res = await API.get(`${ConstantApi.task.getTasksByDate}/${formattedDate}`);
//       console.log(res, " this is response by  fetchTasksByDate")

//       if (res.data.success) {
//         const formattedTasks = res.data.tasks.map(task => ({
//           _id: task._id,
//           title: task.title,
//           description: task.description,
//           createdBy: task.createdBy?.department || "Unknown",
//           assignedTo: task.assignedTo?.department || "Unknown",
//           status: task.status,
//           priority: task.priority,
//           dueDate: task.dueDate?.split('T')[0] || task.dueDate,
//           createdAt: task.createdAt?.split('T')[0] || task.createdAt,
//         }));
//         setSelectedDateTasks(formattedTasks);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error fetching tasks for this date");
//       setSelectedDateTasks([]);
//     } finally {
//       setDateLoading(false);
//     }
//   };

//   // Handle date click
//   const handleDateClick = async (date) => {
//     setSelectedDate(date);
//     await fetchTasksByDate(date);
//   };

//   useEffect(() => {
//     getTasksAssignedToMe();
//     getTasksCreatedByMe();
//   }, []);

//   const [taskForm, setTaskForm] = useState({
//     title: "",
//     description: "",
//     assignedTo: "QC",
//     priority: "medium",
//     dueDate: "",
//   });

//   const getCalendarDays = () => {
//     // Get current date dynamically
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth();

//     const firstDayOfMonth = new Date(year, month, 1);
//     const startDay = firstDayOfMonth.getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const days = [];

//     const startOffset = startDay === 0 ? 6 : startDay - 1;

//     // Previous month days
//     for (let i = startOffset - 1; i >= 0; i--) {
//       const prevDate = new Date(year, month, -i);
//       days.push({ date: prevDate, isCurrentMonth: false });
//     }

//     // Current month days
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push({ date: new Date(year, month, i), isCurrentMonth: true });
//     }

//     // Next month days
//     const remaining = 42 - days.length;
//     for (let i = 1; i <= remaining; i++) {
//       const nextDate = new Date(year, month + 1, i);
//       days.push({ date: nextDate, isCurrentMonth: false });
//     }

//     return { days, year, month };
//   };

//   const weekDays = [
//     { key: "mon", label: "M" },
//     { key: "tue", label: "T" },
//     { key: "wed", label: "W" },
//     { key: "thu", label: "T" },
//     { key: "fri", label: "F" },
//     { key: "sat", label: "S" },
//     { key: "sun", label: "S" }
//   ];

//   const calendarData = getCalendarDays();
//   const calendarDays = calendarData.days;
//   const currentYear = calendarData.year;
//   const currentMonth = calendarData.month;

//   const handleAssignTask = async () => {
//     try {
//       if (!taskForm.title || !taskForm.dueDate || !taskForm.assignedTo) return;

//       const newTask = {
//         title: taskForm.title,
//         description: taskForm.description,
//         createdBy: loggedInDepartment,
//         assignedTo: taskForm.assignedTo,
//         status: "pending",
//         priority: taskForm.priority,
//         dueDate: taskForm.dueDate,
//         createdAt: new Date().toISOString().split("T")[0],
//         departmentId: department?.department?.id
//       };

//       console.log(newTask, "this is response of newTask ")

//       const res = await API.post(ConstantApi.task.createTask, newTask)
//       console.log(res, "this is response of create task")

//       if (res.data.success) {
//         toast.success(res?.data?.message || "Task created successfully")
//         setTaskForm({
//           title: "",
//           description: "",
//           assignedTo: "QC",
//           priority: "medium",
//           dueDate: "",
//         });
//         getTasksAssignedToMe();
//         getTasksCreatedByMe();
//       }
//     } catch (error) {
//       console.log(error.response, "this is error from handleAssignTask")
//       toast.error(error?.response?.data?.message)
//     }
//   }

//   const toggleTaskStatus = async (taskId) => {
//     setTasksAssignedToMe(prev =>
//       prev.map((task) =>
//         task._id === taskId
//           ? {
//             ...task,
//             status: task.status === "completed" ? "pending" : "completed",
//           }
//           : task
//       )
//     );

//     try {
//       await API.put(`${ConstantApi.task.updateTaskStatus}/${taskId}`, {
//         status: tasksAssignedToMe.find(t => t._id === taskId)?.status === "completed" ? "pending" : "completed"
//       });
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to update task status");
//       getTasksAssignedToMe();
//     }
//   };

//   const tasksIAssigned = tasksICreated;
//   const tasksAssignedToMyDept = tasksAssignedToMe;

//   const filteredTasksIAssigned = useMemo(() => {
//     // Remove department filter - only search filter
//     return tasksIAssigned.filter((task) => {
//       const matchesSearch =
//         task.title.toLowerCase().includes(search.toLowerCase()) ||
//         task.description.toLowerCase().includes(search.toLowerCase());
//       return matchesSearch;
//     });
//   }, [tasksIAssigned, search]);

//   const filteredTasksAssignedToMe = useMemo(() => {
//     return tasksAssignedToMyDept.filter((task) => {
//       // No department filter here - only search
//       const matchesSearch =
//         task.title.toLowerCase().includes(search.toLowerCase()) ||
//         task.description.toLowerCase().includes(search.toLowerCase());
//       return matchesSearch;
//     });
//   }, [tasksAssignedToMyDept, search]);

//   console.log("All tasks:", tasksAssignedToMyDept);
//   console.log("Selected Dept:", selectedDept);
//   console.log("Filtered tasks:", filteredTasksAssignedToMe);

//   const getStatusDot = (status) => {
//     if (status === "completed") return "bg-green-700";
//     if (status === "in_progress") return "bg-yellow-600";
//     return "bg-red-700";
//   };

//   const getPriorityBadge = (priority) => {
//     const map = {
//       low: "bg-green-100 text-green-800",
//       medium: "bg-blue-100 text-blue-800",
//       high: "bg-orange-100 text-orange-800",
//       urgent: "bg-red-100 text-red-800",
//     };
//     return map[priority] || map.medium;
//   };

//   const getPriorityIcon = (priority) => {
//     const icons = {
//       low: <Flag className="w-3 h-3" />,
//       medium: <Flag className="w-3 h-3" />,
//       high: <AlertTriangle className="w-3 h-3" />,
//       urgent: <AlertCircle className="w-3 h-3" />,
//     };
//     return icons[priority];
//   };

//   const getStatusText = (status) => {
//     if (status === "completed") return "Completed";
//     if (status === "in_progress") return "In Progress";
//     return "Pending";
//   };

//   const pendingCount = tasksAssignedToMyDept.filter(
//     (t) => t.status !== "completed"
//   ).length;

//   const tasksISentCount = tasksIAssigned.length;

//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showTaskModal, setShowTaskModal] = useState(false);

//   const handleTaskClick = (task) => {
//     setSelectedTask(task);
//     setShowTaskModal(true);
//   };

//   const closeModal = () => {
//     setShowTaskModal(false);
//     setSelectedTask(null);
//   };

//   const handleDepartmentClick = (deptName) => {
//     setSelectedDept(deptName);
//     setTaskForm({ ...taskForm, assignedTo: deptName });
//   };

//   const TaskDetailsModal = ({ task, onClose, onToggleStatus }) => {
//     if (!task) return null;

//     const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";

//     return (
//       <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
//           <div className="bg-[#1A237E] text-white p-5 flex justify-between items-center sticky top-0 z-10">
//             <div className="flex items-center gap-3">
//               <div className={`w-3 h-3 rounded-full ${getStatusDot(task.status)}`}></div>
//               <h2 className="text-xl font-bold">{task.title}</h2>
//             </div>
//             <button onClick={onClose} className="text-white hover:text-gray-300">
//               <X size={20} />
//             </button>
//           </div>

//           <div className="p-6 space-y-6">
//             <div className="flex gap-2 flex-wrap">
//               <span className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${getPriorityBadge(task.priority)}`}>
//                 {getPriorityIcon(task.priority)}
//                 {task?.priority?.toUpperCase()}
//               </span>
//               <span className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${task.status === "completed" ? "bg-green-100 text-green-800" :
//                 task.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
//                   "bg-red-100 text-red-800"
//                 }`}>
//                 {getStatusText(task.status)}
//               </span>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Description</h3>
//               <p className="text-gray-700">{task.description}</p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-blue-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500">Created By</p>
//                 <p className="font-bold text-gray-800">{task.createdBy}</p>
//               </div>
//               <div className="bg-purple-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500">Assigned To</p>
//                 <p className="font-bold text-gray-800">{task.assignedTo}</p>
//               </div>
//               <div className="bg-orange-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500">Due Date</p>
//                 <p className={`font-bold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
//                   {new Date(task.dueDate).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="bg-green-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500">Created At</p>
//                 <p className="font-bold text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>

//             <div className="flex gap-3 pt-4">
//               {task.status !== "completed" && task.assignedTo === loggedInDepartment && (
//                 <button
//                   onClick={(e) => {
//                     MarkCompleteTask(task._id)
//                     alert("Task marked as complete!");
//                     setTasksAssignedToMe(prev =>
//                       prev.map((t) =>
//                         t._id === task._id
//                           ? { ...t, status: "completed" }
//                           : t
//                       )
//                     );
//                     onClose();
//                   }}
//                   className="flex-1 bg-[#1A237E] hover:bg-[#283593] text-white py-2 rounded-md font-semibold"
//                 >
//                   Mark as Complete
//                 </button>
//               )}
//               <button onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md font-semibold">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F5DC]">
//       {/* Government Style Navbar */}
//       <nav className="sticky top-0 z-50 bg-[#1A237E] border-b-4 border-[#FF9933] shadow-lg">
//         <div className="max-w-[1450px] mx-auto px-6 py-3 flex items-center flex-wrap justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-full bg-[#FF9933] flex items-center justify-center border-2 border-white">
//               <span className="text-[#1A237E] font-bold text-xl">◎</span>
//             </div>
//             <div>
//               <h1 className="text-white font-bold text:lg sm:text-xl tracking-wide">LANCOM</h1>
//               <p className="text-[#FFE0B2] text-xs">Welcome Back {(department?.department?.headName)?.toUpperCase()}</p>
//             </div>
//           </div>

//           {department.department.role === "admin"} <div className="flex items-center gap-4">
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-3 px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-[#FF9933] text-[#1A237E] font-semibold"
//               >
//                 <div className="w-8 h-8 rounded-full bg-[#1A237E] flex items-center justify-center text-white text-xs font-bold">
//                   {department?.department?.headName?.toUpperCase()?.charAt(0) || "U"}
//                 </div>
//                 <div className="text-left">
//                   <span className="text-sm font-bold">{(department?.department?.headName || " ")?.toUpperCase()}</span>
//                   <p className="text-xs">{(department?.department?.department || "")?.toUpperCase()}</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-200 z-50">
//                   <div className="p-3 border-b bg-gray-50">
//                     <p className="text-xs text-gray-500">Signed in as</p>
//                     <p className="text-sm font-bold text-gray-800">{department?.department?.email || "user@example.com"}</p>
//                   </div>
//                   <div className="py-2">
//                     {department?.department.role === "admin" ? <button
//                       onClick={() => {
//                         setIsDropdownOpen(false);
//                         navigate('/admin/register');
//                       }}
//                       className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                     >
//                       <Building2 size={18} />
//                       <span className="text-sm">Register Department</span>
//                       <div className="border-t my-1"></div>
//                     </button>

//                       : ""}


//                     <button
//                       onClick={() => {
//                         setIsDropdownOpen(false);
//                         dispatch(logout());
//                         navigate('/');
//                       }}
//                       className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
//                     >
//                       <LogOut size={18} />
//                       <span className="text-sm">Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-[1450px] mx-auto px-6 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* LEFT COLUMN */}
//           <div className="lg:col-span-8 space-y-5">
//             {/* Departments Section */}
//             <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#FF9933]">
//                 <h2 className="text-[#1A237E] font-bold text-lg">📋 DEPARTMENTS</h2>
//                 {departments.length > 10 && (
//                   <button
//                     onClick={() => setShowAllDepartments((prev) => !prev)}
//                     className="text-[#1A237E] text-sm font-medium hover:underline"
//                   >
//                     {showAllDepartments ? 'Show Less ←' : 'View All →'}
//                   </button>
//                 )}
//               </div>
//               <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
//                 {loadingDepartments ? (
//                   // Loading skeleton
//                   Array(5).fill(0).map((_, idx) => (
//                     <div key={idx} className="p-3 text-center animate-pulse">
//                       <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full"></div>
//                       <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
//                     </div>
//                   ))
//                 ) : (
//                   (showAllDepartments ? departments : departments.slice(0, 10)).map((dept) => {
//                     const Icon = dept.icon;
//                     const deptPendingCount = tasksAssignedToMyDept.filter(
//                       (t) => t.assignedTo === dept.name && t.status !== "completed"
//                     ).length;

//                     return (
//                       <button
//                         key={dept.name}
//                         onClick={() => handleDepartmentClick(dept.name)}
//                         className={`p-3 text-center transition-all rounded-lg border ${selectedDept === dept.name
//                           ? "bg-[#1A237E] text-white border-[#FF9933] shadow-md"
//                           : "bg-white text-gray-700 border-gray-300 hover:border-[#FF9933] hover:shadow-sm"
//                           }`}
//                       >
//                         <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedDept === dept.name ? "text-white" : "text-[#1A237E]"}`} />
//                         <p className={`text-xs font-bold ${selectedDept === dept.name ? "text-white" : "text-gray-700"}`}>
//                           {dept.name}
//                         </p>
//                         {deptPendingCount > 0 && (
//                           <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${selectedDept === dept.name
//                             ? "bg-[#FF9933] text-[#1A237E]"
//                             : "bg-red-500 text-white"
//                             }`}>
//                             {deptPendingCount}
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="🔍 Search tasks by title, description..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 focus:border-[#1A237E] focus:outline-none"
//               />
//             </div>

//             {/* Create Task Form */}
//             <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm">
//               <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#FF9933]">
//                 <div className="w-8 h-8 rounded-full bg-[#1A237E] flex items-center justify-center">
//                   <Plus className="w-4 h-4 text-white" />
//                 </div>
//                 <h3 className="text-[#1A237E] font-bold text-lg">CREATE NEW TASK</h3>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">TASK TITLE *</label>
//                   <input
//                     type="text"
//                     value={taskForm.title}
//                     onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
//                     placeholder="Enter task title..."
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">ASSIGN TO *</label>
//                   <select
//                     value={taskForm.assignedTo}
//                     onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none"
//                   >
//                     {departments.map((dept) => (
//                       <option key={dept.name} value={dept.name}>{dept.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">PRIORITY</label>
//                   <select
//                     value={taskForm.priority}
//                     onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                     <option value="urgent">Urgent</option>
//                   </select>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">DUE DATE *</label>
//                   <input
//                     type="date"
//                     value={taskForm.dueDate}
//                     onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">DESCRIPTION</label>
//                   <textarea
//                     rows={3}
//                     value={taskForm.description}
//                     onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
//                     placeholder="Write task details..."
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none resize-none"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={handleAssignTask}
//                   className="px-6 py-2 rounded-md bg-[#1A237E] hover:bg-[#283593] text-white font-semibold transition"
//                 >
//                   + Create Task
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="lg:col-span-4 space-y-5">
//             {/* Calendar Widget */}
//             <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
//               <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[#FF9933]">
//                 <h2 className="text-[#1A237E] font-bold">
//                   📅 {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }).toUpperCase()} {currentYear}
//                 </h2>
//                 <button
//                   onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//                   className="p-1 hover:bg-gray-100 rounded-md transition"
//                 >
//                   <CalendarIcon className="w-5 h-5 text-[#1A237E]" />
//                 </button>
//               </div>
//               {isCalendarOpen && (
//                 <>
//                   <div className="grid grid-cols-7 gap-1 mb-2">
//                     {weekDays.map((day) => (
//                       <div key={day.key} className="text-center text-gray-500 text-xs font-bold py-1">
//                         {day.label}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="grid grid-cols-7 gap-1">
//                     {calendarDays.map((day, idx) => {
//                       const isToday = day.date.toDateString() === new Date().toDateString();
//                       const hasTask = tasksAssignedToMyDept.some(
//                         (task) => task.dueDate === day.date.toISOString().split("T")[0]
//                       );
//                       const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

//                       return (
//                         <button
//                           key={idx}
//                           onClick={() => handleDateClick(day.date)}
//                           className={`h-10 rounded-md text-sm font-semibold transition ${day.isCurrentMonth ? "text-gray-800" : "text-gray-300"
//                             } ${isSelected
//                               ? "bg-[#1A237E] text-white"
//                               : isToday
//                                 ? "bg-[#FF9933] text-white"
//                                 : "hover:bg-gray-100"
//                             }`}
//                         >
//                           {day.date.getDate()}
//                           {hasTask && day.isCurrentMonth && !isSelected && (
//                             <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mx-auto mt-0.5"></div>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* View Toggle Buttons */}
//             <div className="bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setToggleView(1)}
//                   className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${toggleView === 1
//                     ? "bg-[#1A237E] text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                 >
//                   📤 Tasks I've Assigned ({tasksISentCount})
//                 </button>
//                 <button
//                   onClick={() => setToggleView(0)}
//                   className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${toggleView === 0
//                     ? "bg-[#1A237E] text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                 >
//                   📥 Tasks to Me ({pendingCount})
//                 </button>
//               </div>
//             </div>

//             {/* Tasks I've Assigned Section */}
//             {toggleView === 1 && (
//               <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
//                 <div className="bg-[#E8EAF6] p-3 border-b border-gray-300">
//                   <h3 className="text-[#1A237E] font-bold">📤 Tasks I've Assigned</h3>
//                 </div>

//                 {/* Dynamic height - max 340px */}
//                 <div className="max-h-[340px] overflow-y-auto">
//                   {loading ? (
//                     <div className="text-center py-10">Loading...</div>
//                   ) : filteredTasksIAssigned.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">No tasks assigned</div>
//                   ) : (
//                     <div className="divide-y">
//                       {filteredTasksIAssigned.map((task) => (
//                         <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}>
//                           <div className="flex items-start gap-2">
//                             {task.status === "completed" ? (
//                               <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
//                             ) : (
//                               <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
//                             )}
//                             <div className="flex-1">
//                               <p className="text-sm font-semibold text-gray-800">{task.title}</p>
//                               <p className="text-xs text-gray-500 truncate">{task.description}</p>
//                               <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                                 <span>To: {task.assignedTo}</span>
//                                 <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
//                               </div>
//                             </div>
//                             <Eye className="w-4 h-4 text-gray-400" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Tasks Assigned to Me Section */}
//             {toggleView === 0 && (
//               <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
//                 <div className="bg-[#E8EAF6] p-3 border-b border-gray-300">
//                   <h3 className="text-[#1A237E] font-bold">📥 Tasks Assigned to Me</h3>
//                 </div>

//                 {/* Dynamic height - max 340px, lekin kam tasks hain to auto height */}
//                 <div className="max-h-[340px] overflow-y-auto">
//                   {loading ? (
//                     <div className="text-center py-10">Loading...</div>
//                   ) : filteredTasksAssignedToMe.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">No tasks assigned to you</div>
//                   ) : (
//                     <div className="divide-y ">
//                       {filteredTasksAssignedToMe.map((task) => (
//                         <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}>
//                           <div className="flex items-start gap-2">
//                             {task.status === "completed" ? ( 
//                               <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
//                             ) : (
//                               <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
//                             )}
//                             <div className="flex-1">
//                               <p className={`text-sm font-semibold ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
//                                 {task.title}
//                               </p>
//                               <p className="text-xs text-gray-500 truncate">{task.description}</p>
//                               <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                                 <span>From: {task.createdBy}</span>
//                                 <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
//                               </div>
//                             </div>
//                             <Eye className="w-4 h-4 text-gray-400" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Date Tasks - New Dynamic Section */}
//             {selectedDate && (
//               <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
//                 <div className="bg-[#E8EAF6] p-3 border-b border-gray-300 flex justify-between items-center">
//                   <h3 className="text-[#1A237E] font-bold">
//                     📅 {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
//                   </h3>
//                   <button onClick={() => setSelectedDate(null)} className="text-gray-500 hover:text-gray-700">✕</button>
//                 </div>

//                 {/* Dynamic height - max 340px, kam tasks hain to auto height */}
//                 <div className="max-h-[340px] overflow-y-auto">
//                   {dateLoading ? (
//                     <div className="text-center py-6">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A237E] mx-auto"></div>
//                       <p className="text-xs text-gray-500 mt-2">Loading tasks...</p>
//                     </div>
//                   ) : selectedDateTasks.length === 0 ? (
//                     <div className="text-center py-6 text-gray-500">No tasks scheduled for this date</div>
//                   ) : (
//                     <div className="divide-y">
//                       {selectedDateTasks.map((task) => (
//                         <div
//                           key={task._id}
//                           onClick={() => handleTaskClick(task)}
//                          className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}
//                         >
//                           <div className="flex items-start gap-2">
//                             {task.status === "completed" ? (
//                               <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
//                             ) : (
//                               <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
//                             )}
//                             <div className="flex-1">
//                               <p className={`text-sm font-semibold ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
//                                 {task.title}
//                               </p>
//                               <p className="text-xs text-gray-500">To: {task.assignedTo}</p>
//                               <p className="text-xs text-gray-500">From: {task.createdBy}</p>
//                               <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description || "No description"}</p>
//                             </div>
//                             <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Optional: Show task count */}
//                 {selectedDateTasks.length > 0 && (
//                   <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500">
//                     Total: {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {showTaskModal && selectedTask && (
//         <TaskDetailsModal task={selectedTask} onClose={closeModal} onToggleStatus={toggleTaskStatus} />
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Box,
  ShoppingCart,
  Users,
  Server,
  BarChart3,
  Settings,
  Layers,
  Activity,
  Circle,
  Calendar as CalendarIcon,
  X,
  Flag,
  Eye,
  Plus,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ConstantApi from "../../services/endpoints.js";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import API from "../../services/axiosConfig.js";
import { logout } from "../../store/authSlice.js";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDept, setSelectedDept] = useState("admin");
  const [search, setSearch] = useState("");
  const [toggleView, setToggleView] = useState(0);
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tasksAssignedToMe, setTasksAssignedToMe] = useState([]);
  const [tasksICreated, setTasksICreated] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for dynamic departments from backend
  const [allDepartments, setAllDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  // New state for selected date tasks
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [dateLoading, setDateLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  
  // State to store random icons for new departments
  const [randomDepartmentIcons, setRandomDepartmentIcons] = useState({});

  const department = useSelector(state => state.auth)

  console.log(department, " this is my department")

  const loggedInDepartment = department?.department?.department || "ADMIN";
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Array of available icons for random assignment
  const availableIcons = [
    CheckCircle, Box, Layers, ShoppingCart, BarChart3, 
    Server, Users, Settings, Activity, Building2, AlertCircle, Flag
  ];

  // Function to get random icon
  const getRandomIcon = () => {
    return availableIcons[Math.floor(Math.random() * availableIcons.length)];
  };

  // Store random icons for new departments
  useEffect(() => {
    if (allDepartments.length > 0) {
      const iconMap = {
        'QC': CheckCircle,
        'PRDN': Box,
        'DESIGN': Layers,
        'STORE': ShoppingCart,
        'PRCHS': BarChart3,
        'AC': BarChart3,
        'IT': Server,
        'SALES': Users,
        'ADMIN': Settings,
        'MNTNS': Activity,
        'admin': Settings,
        'it': Server,
        'design': Layers,
        'sales': Users,
        'store': ShoppingCart,
        'qc': CheckCircle,
        'prdns': Box,
        'prchs': BarChart3,
        'ac': BarChart3,
        'mntns': Activity,
      };

      const newIcons = { ...randomDepartmentIcons };
      allDepartments.forEach(deptName => {
        const upperDept = deptName.toUpperCase();
        // If department doesn't have a predefined icon and no random icon yet, assign one
        if (!iconMap[upperDept] && !newIcons[upperDept]) {
          newIcons[upperDept] = getRandomIcon();
        }
      });
      setRandomDepartmentIcons(newIcons);
    }
  }, [allDepartments]);

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const res = await API.post(ConstantApi.task.getAllDepartment);
        console.log(res, " this is my response ");
        
        // Extract departments from response
        if (res.data && res.data.data) {
          setAllDepartments(res.data.data);
        }
      } catch (error) {
        console.log(error, " this is my response fetchDepartment");
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  // Dynamic departments with icons mapping
  const departments = useMemo(() => {
    // Icon mapping for departments
    const iconMap = {
      'QC': CheckCircle,
      'PRDN': Box,
      'DESIGN': Layers,
      'STORE': ShoppingCart,
      'PRCHS': BarChart3,
      'AC': BarChart3,
      'IT': Server,
      'SALES': Users,
      'ADMIN': Settings,
      'MNTNS': Activity,
      'admin': Settings,
      'it': Server,
      'design': Layers,
      'sales': Users,
      'store': ShoppingCart,
      'qc': CheckCircle,
      'prdns': Box,
      'prchs': BarChart3,
      'ac': BarChart3,
      'mntns': Activity,
    };
    
    // If backend data is loaded, use it
    if (allDepartments.length > 0) {
      return allDepartments.map(deptName => {
        const upperDept = deptName.toUpperCase();
        // Use predefined icon if exists, otherwise use the random assigned icon
        const icon = iconMap[upperDept] || randomDepartmentIcons[upperDept] || Building2;
        return {
          name: upperDept,
          icon: icon
        };
      });
    }
    
    // Fallback to static departments while loading or if no data
    return [
      { name: "QC", icon: CheckCircle },
      { name: "PRDN", icon: Box },
      { name: "DESIGN", icon: Layers },
      { name: "STORE", icon: ShoppingCart },
      { name: "PRCHS", icon: BarChart3 },
      { name: "AC", icon: BarChart3 },
      { name: "IT", icon: Server },
      { name: "SALES", icon: Users },
      { name: "ADMIN", icon: Settings },
      { name: "MNTNS", icon: Activity },
    ];
  }, [allDepartments, randomDepartmentIcons]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const MarkCompleteTask = async (taskId) => {
    try {
      console.log(taskId, " this i smy task id")
      const res = await API.post(ConstantApi.task.markCompleteTask, { taskId })
      console.log(res, " this is my response ")

      if (res.data.success) {
        toast.success(res?.data?.message || "Task completed successfully")
      }

    } catch (error) {
      console.log(error, " error from markCompleteTask")
    }
  }

  const getTasksAssignedToMe = async () => {
    try {
      setLoading(true);
      const res = await API.get(ConstantApi.task.getTasksAssignedToMe);
      console.log(res, "this is my response of fetch task");

      if (res.data.success && res.data.tasks) {
        const formattedTasks = res.data.tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          createdBy: task.createdBy?.department || "Unknown",
          assignedTo: task.assignedTo?.department || "Unknown",
          status: task.status,
          createdAt: task.createdAt?.split('T')[0] || task.createdAt,
          comments: task.comments || 0,
          attachments: task.attachments || 0,
        }));
        setTasksAssignedToMe(formattedTasks)
      }
    } catch (error) {
      console.log(error?.response, "error from fetchtask");
      toast.error(error?.response?.data?.message || "Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const getTasksCreatedByMe = async () => {
    try {
      const res = await API.get(ConstantApi.task.getTasksCreatedByMe);
      if (res.data.success && res.data.tasks) {
        const formattedTasks = res.data.tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          createdBy: task.createdBy?.department || "Unknown",
          assignedTo: task.assignedTo?.department || "Unknown",
          status: task.status,
          createdAt: task.createdAt?.split('T')[0] || task.createdAt,
        }));
        setTasksICreated(formattedTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // New function to fetch tasks by date
  const fetchTasksByDate = async (date) => {
    try {
      setDateLoading(true);
      // Use local date instead of UTC to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const res = await API.get(`${ConstantApi.task.getTasksByDate}/${formattedDate}`);
      console.log(res, " this is response by  fetchTasksByDate")

      if (res.data.success) {
        const formattedTasks = res.data.tasks.map(task => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          createdBy: task.createdBy?.department || "Unknown",
          assignedTo: task.assignedTo?.department || "Unknown",
          status: task.status,
          createdAt: task.createdAt?.split('T')[0] || task.createdAt,
        }));
        setSelectedDateTasks(formattedTasks);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks for this date");
      setSelectedDateTasks([]);
    } finally {
      setDateLoading(false);
    }
  };

  // Handle date click
  const handleDateClick = async (date) => {
    setSelectedDate(date);
    await fetchTasksByDate(date);
  };

  useEffect(() => {
    getTasksAssignedToMe();
    getTasksCreatedByMe();
  }, []);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "QC",
  });

  const getCalendarDays = () => {
    // Get current date dynamically
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const startOffset = startDay === 0 ? 6 : startDay - 1;

    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return { days, year, month };
  };

  const weekDays = [
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
    { key: "sun", label: "S" }
  ];

  const calendarData = getCalendarDays();
  const calendarDays = calendarData.days;
  const currentYear = calendarData.year;
  const currentMonth = calendarData.month;

  const handleAssignTask = async () => {
    try {
      const newTask = {
        title: taskForm.title,
        description: taskForm.description,
        createdBy: loggedInDepartment,
        assignedTo: taskForm.assignedTo,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        departmentId: department?.department?.id
      };

      console.log(newTask, "this is response of newTask ")

      const res = await API.post(ConstantApi.task.createTask, newTask)
      console.log(res, "this is response of create task")

      if (res.data.success) {
        toast.success(res?.data?.message || "Task created successfully")
        setTaskForm({
          title: "",
          description: "",
          assignedTo: "QC",
        });
        getTasksAssignedToMe();
        getTasksCreatedByMe();
      }
    } catch (error) {
      console.log(error.response, "this is error from handleAssignTask")
      toast.error(error?.response?.data?.message)
    }
  }

  const toggleTaskStatus = async (taskId) => {
    setTasksAssignedToMe(prev =>
      prev.map((task) =>
        task._id === taskId
          ? {
            ...task,
            status: task.status === "completed" ? "pending" : "completed",
          }
          : task
      )
    );

    try {
      await API.put(`${ConstantApi.task.updateTaskStatus}/${taskId}`, {
        status: tasksAssignedToMe.find(t => t._id === taskId)?.status === "completed" ? "pending" : "completed"
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task status");
      getTasksAssignedToMe();
    }
  };

  const tasksIAssigned = tasksICreated;
  const tasksAssignedToMyDept = tasksAssignedToMe;

  const filteredTasksIAssigned = useMemo(() => {
    // Remove department filter - only search filter
    return tasksIAssigned.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [tasksIAssigned, search]);

  const filteredTasksAssignedToMe = useMemo(() => {
    return tasksAssignedToMyDept.filter((task) => {
      // No department filter here - only search
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [tasksAssignedToMyDept, search]);

  console.log("All tasks:", tasksAssignedToMyDept);
  console.log("Selected Dept:", selectedDept);
  console.log("Filtered tasks:", filteredTasksAssignedToMe);

  const getStatusDot = (status) => {
    if (status === "completed") return "bg-green-700";
    if (status === "in_progress") return "bg-yellow-600";
    return "bg-red-700";
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "in_progress") return "In Progress";
    return "Pending";
  };

  const pendingCount = tasksAssignedToMyDept.filter(
    (t) => t.status !== "completed"
  ).length;

  const tasksISentCount = tasksIAssigned.length;

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleDepartmentClick = (deptName) => {
    setSelectedDept(deptName);
    setTaskForm({ ...taskForm, assignedTo: deptName });
  };

  const TaskDetailsModal = ({ task, onClose, onToggleStatus }) => {
    if (!task) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="bg-[#1A237E] text-white p-5 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusDot(task.status)}`}></div>
              <h2 className="text-xl font-bold">{task.title}</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Description</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Created By</p>
                <p className="font-bold text-gray-800">{task.createdBy}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="font-bold text-gray-800">{task.assignedTo}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Created At</p>
                <p className="font-bold text-gray-800">{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {task.status !== "completed" && task.assignedTo === loggedInDepartment && (
                <button
                  onClick={(e) => {
                    MarkCompleteTask(task._id)
                    alert("Task marked as complete!");
                    setTasksAssignedToMe(prev =>
                      prev.map((t) =>
                        t._id === task._id
                          ? { ...t, status: "completed" }
                          : t
                      )
                    );
                    onClose();
                  }}
                  className="flex-1 bg-[#1A237E] hover:bg-[#283593] text-white py-2 rounded-md font-semibold"
                >
                  Mark as Complete
                </button>
              )}
              <button onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Government Style Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1A237E] border-b-4 border-[#FF9933] shadow-lg">
        <div className="max-w-[1450px] mx-auto px-6 py-3 flex items-center flex-wrap justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FF9933] flex items-center justify-center border-2 border-white">
              <span className="text-[#1A237E] font-bold text-xl">◎</span>
            </div>
            <div>
              <h1 className="text-white font-bold text:lg sm:text-xl tracking-wide">LANCOM</h1>
              <p className="text-[#FFE0B2] text-xs">Welcome Back {(department?.department?.headName)?.toUpperCase()}</p>
            </div>
          </div>

          {department.department.role === "admin"} <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-[#FF9933] text-[#1A237E] font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-[#1A237E] flex items-center justify-center text-white text-xs font-bold">
                  {department?.department?.headName?.toUpperCase()?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold">{(department?.department?.headName || " ")?.toUpperCase()}</span>
                  <p className="text-xs">{(department?.department?.department || "")?.toUpperCase()}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b bg-gray-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800">{department?.department?.email || "user@example.com"}</p>
                  </div>
                  <div className="py-2">
                    {department?.department.role === "admin" ? <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/admin/register');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Building2 size={18} />
                      <span className="text-sm">Register Department</span>
                      <div className="border-t my-1"></div>
                    </button>

                      : ""}


                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        dispatch(logout());
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1450px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-5">
            {/* Departments Section */}
            <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#FF9933]">
                <h2 className="text-[#1A237E] font-bold text-lg">📋 DEPARTMENTS</h2>
                {departments.length > 10 && (
                  <button
                    onClick={() => setShowAllDepartments((prev) => !prev)}
                    className="text-[#1A237E] text-sm font-medium hover:underline"
                  >
                    {showAllDepartments ? 'Show Less ←' : 'View All →'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {loadingDepartments ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, idx) => (
                    <div key={idx} className="p-3 text-center animate-pulse">
                      <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                    </div>
                  ))
                ) : (
                  (showAllDepartments ? departments : departments.slice(0, 10)).map((dept) => {
                    const Icon = dept.icon;
                    const deptPendingCount = tasksAssignedToMyDept.filter(
                      (t) => t.assignedTo === dept.name && t.status !== "completed"
                    ).length;

                    return (
                      <button
                        key={dept.name}
                        onClick={() => handleDepartmentClick(dept.name)}
                        className={`p-3 text-center transition-all rounded-lg border ${selectedDept === dept.name
                          ? "bg-[#1A237E] text-white border-[#FF9933] shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#FF9933] hover:shadow-sm"
                          }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${selectedDept === dept.name ? "text-white" : "text-[#1A237E]"}`} />
                        <p className={`text-xs font-bold ${selectedDept === dept.name ? "text-white" : "text-gray-700"}`}>
                          {dept.name}
                        </p>
                        {deptPendingCount > 0 && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${selectedDept === dept.name
                            ? "bg-[#FF9933] text-[#1A237E]"
                            : "bg-red-500 text-white"
                            }`}>
                            {deptPendingCount}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Search tasks by title, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 focus:border-[#1A237E] focus:outline-none"
              />
            </div>

            {/* Create Task Form */}
            <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#FF9933]">
                <div className="w-8 h-8 rounded-full bg-[#1A237E] flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[#1A237E] font-bold text-lg">CREATE NEW TASK</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-gray-700 text-xs font-bold mb-1 block">TASK TITLE *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Enter task title..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-gray-700 text-xs font-bold mb-1 block">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Write task details..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1A237E] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAssignTask}
                  className="px-6 py-2 rounded-md bg-[#1A237E] hover:bg-[#283593] text-white font-semibold transition"
                >
                  + Create Task
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-5">
            {/* Calendar Widget */}
            <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[#FF9933]">
                <h2 className="text-[#1A237E] font-bold">
                  📅 {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }).toUpperCase()} {currentYear}
                </h2>
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="p-1 hover:bg-gray-100 rounded-md transition"
                >
                  <CalendarIcon className="w-5 h-5 text-[#1A237E]" />
                </button>
              </div>
              {isCalendarOpen && (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day.key} className="text-center text-gray-500 text-xs font-bold py-1">
                        {day.label}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      const isToday = day.date.toDateString() === new Date().toDateString();
                      const hasTask = tasksAssignedToMyDept.some(
                        (task) => task?.dueDate === day?.date?.toISOString().split("T")[0]
                      );
                      const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

                      return (
                        <button
                          key={idx}
                          onClick={() => handleDateClick(day.date)}
                          className={`h-10 rounded-md text-sm font-semibold transition ${day.isCurrentMonth ? "text-gray-800" : "text-gray-300"
                            } ${isSelected
                              ? "bg-[#1A237E] text-white"
                              : isToday
                                ? "bg-[#FF9933] text-white"
                                : "hover:bg-gray-100"
                            }`}
                        >
                          {day.date.getDate()}
                          {hasTask && day.isCurrentMonth && !isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mx-auto mt-0.5"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* View Toggle Buttons */}
            <div className="bg-white rounded-lg border border-gray-300 p-1 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setToggleView(1)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${toggleView === 1
                    ? "bg-[#1A237E] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  📤 Tasks I've Assigned ({tasksISentCount})
                </button>
                <button
                  onClick={() => setToggleView(0)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${toggleView === 0
                    ? "bg-[#1A237E] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  📥 Tasks to Me ({pendingCount})
                </button>
              </div>
            </div>

            {/* Tasks I've Assigned Section */}
            {toggleView === 1 && (
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-[#E8EAF6] p-3 border-b border-gray-300">
                  <h3 className="text-[#1A237E] font-bold">📤 Tasks I've Assigned</h3>
                </div>

                {/* Dynamic height - max 340px */}
                <div className="max-h-[340px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-10">Loading...</div>
                  ) : filteredTasksIAssigned.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No tasks assigned</div>
                  ) : (
                    <div className="divide-y">
                      {filteredTasksIAssigned.map((task) => (
                        <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}>
                          <div className="flex items-start gap-2">
                            {task.status === "completed" ? (
                              <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                              <p className="text-xs text-gray-500 truncate">{task.description}</p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                <span>To: {task.assignedTo}</span>
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks Assigned to Me Section */}
            {toggleView === 0 && (
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-[#E8EAF6] p-3 border-b border-gray-300">
                  <h3 className="text-[#1A237E] font-bold">📥 Tasks Assigned to Me</h3>
                </div>

                {/* Dynamic height - max 340px, lekin kam tasks hain to auto height */}
                <div className="max-h-[340px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-10">Loading...</div>
                  ) : filteredTasksAssignedToMe.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No tasks assigned to you</div>
                  ) : (
                    <div className="divide-y ">
                      {filteredTasksAssignedToMe.map((task) => (
                        <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}>
                          <div className="flex items-start gap-2">
                            {task.status === "completed" ? ( 
                              <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{task.description}</p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                <span>From: {task.createdBy}</span>
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Selected Date Tasks - New Dynamic Section */}
            {selectedDate && (
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                <div className="bg-[#E8EAF6] p-3 border-b border-gray-300 flex justify-between items-center">
                  <h3 className="text-[#1A237E] font-bold">
                    📅 {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </h3>
                  <button onClick={() => setSelectedDate(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* Dynamic height - max 340px, kam tasks hain to auto height */}
                <div className="max-h-[340px] overflow-y-auto">
                  {dateLoading ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A237E] mx-auto"></div>
                      <p className="text-xs text-gray-500 mt-2">Loading tasks...</p>
                    </div>
                  ) : selectedDateTasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No tasks scheduled for this date</div>
                  ) : (
                    <div className="divide-y">
                      {selectedDateTasks.map((task) => (
                        <div
                          key={task._id}
                          onClick={() => handleTaskClick(task)}
                         className={`p-3 hover:bg-gray-50 cursor-pointer   ${task.status === "completed" ? "bg-green-100 " : "bg-pink-100"} border border-gray-300`}
                        >
                          <div className="flex items-start gap-2">
                            {task.status === "completed" ? (
                              <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500">To: {task.assignedTo}</p>
                              <p className="text-xs text-gray-500">From: {task.createdBy}</p>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description || "No description"}</p>
                            </div>
                            <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Optional: Show task count */}
                {selectedDateTasks.length > 0 && (
                  <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500">
                    Total: {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {showTaskModal && selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={closeModal} onToggleStatus={toggleTaskStatus} />
      )}
    </div>
  );
};

export default Dashboard;