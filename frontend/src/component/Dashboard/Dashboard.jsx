
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
//   Bold,
//   Italic,
//   Underline,
//   Type,
//   Image as ImageIcon,
// } from "lucide-react";
// import { useNavigate } from 'react-router-dom';
// import { LogOut } from 'lucide-react';
// import ConstantApi from "../../services/endpoints.js";
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from "react-toastify";
// import API from "../../services/axiosConfig.js";
// import { logout } from "../../store/authSlice.js";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";

// // Simplified - removing problematic extensions
// // @tiptap/extension-underline, @tiptap/extension-text-align, etc. are causing issues

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
//   const [creatingTask, setCreatingTask] = useState(false);
//   const fileInputRef = useRef(null);

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
//     assignedTo: "",
//   });

//   // Simplified Editor configuration - only working extensions
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bold: true,
//         italic: true,
//         strike: true,
//         heading: false,
//         bulletList: true,
//         orderedList: true,
//       }),
//       Image.configure({
//         inline: true,
//         allowBase64: false,
//       }),
//     ],
//     content: taskForm.description || "<p>Write task description here...</p>",
//     editable: true,
//     immediatelyRender: false,
//     onUpdate({ editor }) {
//       const html = editor.getHTML();
//       setTaskForm((prev) => ({
//         ...prev,
//         description: html === "<p></p>" ? "" : html
//       }));
//     },
//   });

//   // Update editor content when taskForm.description changes externally
//   useEffect(() => {
//     if (editor && taskForm.description !== editor.getHTML()) {
//       const content = taskForm.description || "<p></p>";
//       editor.commands.setContent(content);
//     }
//   }, [taskForm.description, editor]);

//   // Text formatting functions
//   const toggleBold = () => editor?.chain().focus().toggleBold().run();
//   const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
//   const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
//   const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
//   const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();

//   // Handle image upload from file input
//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       await uploadImage(file);
//     }
//   };

//   // Handle drag and drop
//   const handleImageDrop = async (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//       await uploadImage(file);
//     }
//   };

//   // Common upload function
//   const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await API.post(ConstantApi.task.uploadImage, formData);
//       const imageUrl = res.data.url;
//       if (editor) {
//         editor.chain().focus().setImage({ src: imageUrl }).run();
//       }
//       toast.success("Image uploaded successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Image upload failed");
//     }
//   };

//   // Trigger file input click
//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

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

//         console.log("1. Checking assignedTo:", taskForm.assignedTo);


//     if (!taskForm.assignedTo || taskForm.assignedTo === "") {
//       toast.error("Please select a department first!");
//       return;
//     }

//         console.log("3. Checking title:", taskForm.title);
//     if (!taskForm.title.trim()) {
//       toast.error("Please enter task title!");
//       return;
//     }


//     console.log("5. Checking creatingTask:", creatingTask);
//     if (creatingTask) {
//       return;
//     }

//       console.log("7. All validations passed, creating task...");

//     try {

//       setCreatingTask(true);
//       const newTask = {
//         title: taskForm.title,
//         description: taskForm.description,
//         createdBy: loggedInDepartment,
//         assignedTo: taskForm.assignedTo,
//         status: "pending",
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
//           assignedTo: "",
//         });
//         // Clear editor content
//         if (editor) {
//           editor.commands.setContent("<p></p>");
//         }
//         getTasksAssignedToMe();
//         getTasksCreatedByMe();
//       }
//     } catch (error) {
//       console.log(error.response, "this is error from handleAssignTask")
//       toast.error(error?.response?.data?.message)
//     }
//     finally {
//       setCreatingTask(false);
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
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <h3 className="text-xs font-bold text-gray-600 mb-2 uppercase">Description</h3>
//               <div className="text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: task.description }} />
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
//               <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
//                 placeholder="Search tasks by title, description..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full rounded-lg border-2 border-gray-300 py-1.5 pl-9 pr-4 text-sm focus:border-[#1A237E] focus:outline-none"
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

//                 <div className="md:col-span-2">
//                   <label className="text-gray-700 text-xs font-bold mb-1 block">DESCRIPTION</label>

//                   {/* Hidden file input */}
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                     accept="image/*"
//                     className="hidden"
//                   />

//                   {/* Editor Toolbar */}
//                   <div className="flex flex-wrap gap-1 border border-gray-300 rounded-t-md p-2 bg-gray-50">
//                     <button
//                       type="button"
//                       onClick={toggleBold}
//                       className={`p-1.5 rounded hover:bg-gray-200 transition ${editor?.isActive('bold') ? 'bg-gray-300' : ''}`}
//                       title="Bold (Ctrl+B)"
//                     >
//                       <Bold size={16} />
//                     </button>
//                     <button
//                       type="button"
//                       onClick={toggleItalic}
//                       className={`p-1.5 rounded hover:bg-gray-200 transition ${editor?.isActive('italic') ? 'bg-gray-300' : ''}`}
//                       title="Italic (Ctrl+I)"
//                     >
//                       <Italic size={16} />
//                     </button>
//                     <button
//                       type="button"
//                       onClick={toggleStrike}
//                       className={`p-1.5 rounded hover:bg-gray-200 transition ${editor?.isActive('strike') ? 'bg-gray-300' : ''}`}
//                       title="Strikethrough"
//                     >
//                       <Type size={16} />
//                     </button>

//                     <div className="w-px h-6 bg-gray-300 mx-1"></div>

//                     <button
//                       type="button"
//                       onClick={toggleBulletList}
//                       className={`p-1.5 rounded hover:bg-gray-200 transition ${editor?.isActive('bulletList') ? 'bg-gray-300' : ''}`}
//                       title="Bullet List"
//                     >
//                       • List
//                     </button>
//                     <button
//                       type="button"
//                       onClick={toggleOrderedList}
//                       className={`p-1.5 rounded hover:bg-gray-200 transition ${editor?.isActive('orderedList') ? 'bg-gray-300' : ''}`}
//                       title="Numbered List"
//                     >
//                       1. List
//                     </button>

//                     <div className="w-px h-6 bg-gray-300 mx-1"></div>

//                     <button
//                       type="button"
//                       onClick={triggerFileInput}
//                       className="p-1.5 rounded hover:bg-gray-200 transition"
//                       title="Upload Image"
//                     >
//                       <ImageIcon size={16} />
//                     </button>
//                   </div>

//                   {/* Editor Content */}
//                   <div
//                     onDrop={handleImageDrop}
//                     onDragOver={(e) => e.preventDefault()}
//                     className="border border-gray-300 border-t-0 rounded-b-md p-3 min-h-[200px] cursor-text bg-white"
//                     onClick={() => editor?.commands.focus()}
//                   >
//                     <EditorContent editor={editor} />
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">
//                     💡 Tip: You can type text, drag & drop images, or click the image icon to upload
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={handleAssignTask}
//                   disabled={creatingTask}
//                   className={`px-6 py-2 rounded-md text-white font-semibold transition ${creatingTask
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-[#1A237E] hover:bg-[#04050c]"
//                     }`}
//                 >
//                   {creatingTask ? "Creating Task..." : "+ Create Task"}
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
//                         (task) => task?.dueDate === day?.date?.toISOString().split("T")[0]
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

//                 <div className="max-h-[340px] overflow-y-auto">
//                   {loading ? (
//                     <div className="text-center py-10">Loading...</div>
//                   ) : filteredTasksIAssigned.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">No tasks assigned</div>
//                   ) : (
//                     <div className="divide-y">
//                       {filteredTasksIAssigned.map((task) => (
//                         <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer ${task.status === "completed" ? "bg-green-100" : "bg-pink-100"} border border-gray-300`}>
//                           <div className="flex items-start gap-2">
//                             {task.status === "completed" ? (
//                               <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div>
//                             ) : (
//                               <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div>
//                             )}
//                             <div className="flex-1">
//                               <p className="text-sm font-semibold text-gray-800">{task.title}</p>
//                               <div className="text-xs text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: task.description }} />
//                               <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                                 <span>To: {task.assignedTo}</span>
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

//                 <div className="max-h-[340px] overflow-y-auto">
//                   {loading ? (
//                     <div className="text-center py-10">Loading...</div>
//                   ) : filteredTasksAssignedToMe.length === 0 ? (
//                     <div className="text-center py-10 text-gray-500">No tasks assigned to you</div>
//                   ) : (
//                     <div className="divide-y">
//                       {filteredTasksAssignedToMe.map((task) => (
//                         <div key={task._id} onClick={() => handleTaskClick(task)} className={`p-3 hover:bg-gray-50 cursor-pointer ${task.status === "completed" ? "bg-green-100" : "bg-pink-100"} border border-gray-300`}>
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
//                               <div className="text-xs text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: task.description }} />
//                               <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                                 <span>From: {task.createdBy}</span>
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

//             {/* Selected Date Tasks */}
//             {selectedDate && (
//               <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
//                 <div className="bg-[#E8EAF6] p-3 border-b border-gray-300 flex justify-between items-center">
//                   <h3 className="text-[#1A237E] font-bold">
//                     📅 {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
//                   </h3>
//                   <button onClick={() => setSelectedDate(null)} className="text-gray-500 hover:text-gray-700">✕</button>
//                 </div>

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
//                           className={`p-3 hover:bg-gray-50 cursor-pointer ${task.status === "completed" ? "bg-green-100" : "bg-pink-100"} border border-gray-300`}
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
//                               <div className="text-xs text-gray-400 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: task.description || "No description" }} />
//                             </div>
//                             <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

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
// {/* 
//       <style jsx>{`
//         .ProseMirror {
//           outline: none;
//           min-height: 150px;
//         }
//         .ProseMirror p {
//           margin: 0 0 8px 0;
//         }
//         .ProseMirror img {
//           max-width: 100%;
//           height: auto;
//           margin: 10px 0;
//           border-radius: 8px;
//         }
//         .ProseMirror ul, .ProseMirror ol {
//           padding-left: 20px;
//           margin: 8px 0;
//         }
//         .ProseMirror strong {
//           font-weight: bold;
//         }
//         .ProseMirror em {
//           font-style: italic;
//         }
//       `}</style> */}


// <style jsx global>{`
//   .ProseMirror {
//     outline: none;
//     min-height: 150px;
//   }
//   .ProseMirror p {
//     margin: 0 0 8px 0;
//   }

//   /* Image size control */
//   .ProseMirror img {
//     max-width: 100% !important;
//     max-height: 200px !important;
//     width: auto !important;
//     height: auto !important;
//     object-fit: contain !important;
//     margin: 10px 0 !important;
//     border-radius: 8px !important;
//     cursor: pointer !important;
//     border: 1px solid #e0e0e0 !important;
//     box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
//   }

//   .ProseMirror img:hover {
//     opacity: 0.9;
//     border-color: #1A237E;
//   }

//   /* ✅ FIXED List Styles */
//   .ProseMirror ul,
//   .ProseMirror ol {
//     padding-left: 1.5rem !important;
//     margin: 0.5rem 0 !important;
//   }

//   .ProseMirror ul {
//     list-style-type: disc !important;
//   }

//   .ProseMirror ol {
//     list-style-type: decimal !important;
//   }

//   .ProseMirror li {
//     margin: 0.25rem 0 !important;
//     display: list-item !important;
//   }

//   /* Make sure list items have proper markers */
//   .ProseMirror ul li::marker,
//   .ProseMirror ol li::marker {
//     color: #1A237E !important;
//   }

//   /* For nested lists */
//   .ProseMirror ul ul {
//     list-style-type: circle !important;
//   }

//   .ProseMirror ol ol {
//     list-style-type: lower-alpha !important;
//   }

//   .ProseMirror strong {
//     font-weight: bold;
//   }

//   .ProseMirror em {
//     font-style: italic;
//   }

//   .ProseMirror-focused {
//     outline: none;
//   }
// `}</style>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useMemo, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
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
  Bold,
  Italic,
  Type,
  Image as ImageIcon,
  ClipboardList,
  Send,
  Inbox,
  Paperclip,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ConstantApi from "../../services/endpoints.js";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import API from "../../services/axiosConfig.js";
import { logout } from "../../store/authSlice.js";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

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
  const [creatingTask, setCreatingTask] = useState(false);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

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

    if (allDepartments.length > 0) {
      return allDepartments.map(deptName => {
        const upperDept = deptName.toUpperCase();
        const icon = iconMap[upperDept] || randomDepartmentIcons[upperDept] || Building2;
        return {
          name: upperDept,
          icon: icon
        };
      });
    }

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

  const fetchTasksByDate = async (date) => {
    try {
      setDateLoading(true);
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

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setToggleView(2);
    await fetchTasksByDate(date);
  };

  useEffect(() => {
    getTasksAssignedToMe();
    getTasksCreatedByMe();
  }, []);

  // ── Subscription status + countdown ──────────────────────────────────────
  const [subStatus, setSubStatus] = useState(null);
  const [subCountdown, setSubCountdown] = useState(null);
  const subTimerRef = useRef(null);

  useEffect(() => {
    API.get('/subscription/status').then(r => setSubStatus(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!subStatus?.expiresAt || subStatus?.noExpiry) { setSubCountdown(null); return; }
    const tick = () => {
      const diff = new Date(subStatus.expiresAt) - Date.now();
      if (diff <= 0) { setSubCountdown({ h:0, m:0, s:0, total:0 }); return; }
      const total = Math.floor(diff / 1000);
      setSubCountdown({ h: Math.floor(total/3600), m: Math.floor((total%3600)/60), s: total%60, total });
    };
    tick();
    subTimerRef.current = setInterval(tick, 1000);
    return () => clearInterval(subTimerRef.current);
  }, [subStatus?.expiresAt]);


  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connect error:', err);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket error:', err);
    });

    socketRef.current.on('taskCreated', (task) => {
      console.log('Received taskCreated event', task);
      getTasksAssignedToMe();
      getTasksCreatedByMe();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: true,
        italic: true,
        strike: true,
        heading: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: taskForm.description || "<p>Write task description here...</p>",
    editable: true,
    immediatelyRender: false,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setTaskForm((prev) => ({
        ...prev,
        description: html === "<p></p>" ? "" : html
      }));
    },
  });

  useEffect(() => {
    if (editor && taskForm.description !== editor.getHTML()) {
      const content = taskForm.description || "<p></p>";
      editor.commands.setContent(content);
    }
  }, [taskForm.description, editor]);

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadImage(file);
    }
  };

  const handleImageDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post(ConstantApi.task.uploadImage, formData);
      const imageUrl = res.data.url;
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getCalendarDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const startOffset = startDay === 0 ? 6 : startDay - 1;

    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

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

    console.log("1. Checking assignedTo:", taskForm.assignedTo);

    if (!taskForm.assignedTo || taskForm.assignedTo === "") {
      toast.error("Please select a department first!");
      return;
    }

    console.log("3. Checking title:", taskForm.title);
    if (!taskForm.title.trim()) {
      toast.error("Please enter task title!");
      return;
    }

    console.log("5. Checking creatingTask:", creatingTask);
    if (creatingTask) {
      return;
    }

    console.log("7. All validations passed, creating task...");

    try {
      setCreatingTask(true);
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
          assignedTo: "",
        });


        setSelectedDept("");

        if (editor) {
          editor.commands.setContent("<p></p>");
        }
        getTasksAssignedToMe();
        getTasksCreatedByMe();
      }
    } catch (error) {
      console.log(error.response, "this is error from handleAssignTask")
      toast.error(error?.response?.data?.message)
    } finally {
      setCreatingTask(false);
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
    return tasksIAssigned.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [tasksIAssigned, search]);

  const filteredTasksAssignedToMe = useMemo(() => {
    return tasksAssignedToMyDept.filter((task) => {
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
              <div className="text-gray-700 prose prose-sm max-w-none task-description-content" dangerouslySetInnerHTML={{ __html: task.description }} />
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
    <div className="h-screen flex flex-col bg-[#F5F5DC] overflow-hidden">
      <style>{`
        /* Global styles for lists in editor and task display */
        .ProseMirror ul,
        .task-description-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        
        .ProseMirror ol,
        .task-description-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        
        .ProseMirror li,
        .task-description-content li {
          margin: 0.25rem 0 !important;
          display: list-item !important;
        }
        
        .ProseMirror ul li::marker,
        .ProseMirror ol li::marker,
        .task-description-content ul li::marker,
        .task-description-content ol li::marker {
          color: #1A237E !important;
        }
        
        .ProseMirror ul ul {
          list-style-type: circle !important;
        }
        
        .ProseMirror ol ol {
          list-style-type: lower-alpha !important;
        }
        
        .ProseMirror {
          outline: none;
          min-height: 150px;
        }
        
        .ProseMirror p {
          margin: 0 0 8px 0;
        }
        
        .ProseMirror img {
          max-width: 100% !important;
          max-height: 200px !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          margin: 10px 0 !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          border: 1px solid #e0e0e0 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        
        .ProseMirror img:hover {
          opacity: 0.9;
          border-color: #1A237E;
        }
        
        .ProseMirror strong {
          font-weight: bold;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
        
        .ProseMirror-focused {
          outline: none;
        }
      `}</style>

      {/* Government Style Navbar */}
      <nav className="sticky top-0 z-50 bg-[#1A237E] border-b-2 border-[#FF9933] shadow-md">
        <div className="max-w-[1450px] mx-auto px-4 py-1.5 flex items-center flex-wrap justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center border border-white">
              <span className="text-[#1A237E] font-bold text-sm">◎</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm tracking-wide">HONTO'S LANCOM</h1>
              <p className="text-[#FFE0B2] text-[10px]">Welcome Back {(department?.department?.headName)?.toUpperCase()}</p>
            </div>
          </div>

          {department.department.role === "admin"} <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition text-white"
              >
                <div className="w-7 h-7 rounded-full bg-[#FF9933] flex items-center justify-center text-[#1A237E] text-xs font-bold flex-shrink-0">
                  {department?.department?.headName?.toUpperCase()?.charAt(0) || "U"}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-semibold">{(department?.department?.headName || " ")?.toUpperCase()}</p>
                  <p className="text-[10px] text-white/60">{(department?.department?.department || "")?.toUpperCase()}</p>
                </div>
                <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-[#1A237E]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-[#1A237E] text-sm font-bold flex-shrink-0">
                        {department?.department?.headName?.toUpperCase()?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{(department?.department?.headName || "")?.toUpperCase()}</p>
                        <p className="text-white/50 text-[10px] truncate">{department?.department?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  {department?.department?.role === "admin" && (
                    <div className="py-1.5 border-b border-gray-100">
                      <button
                        onClick={() => { setIsDropdownOpen(false); navigate('/admin/profile'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-[#1A237E] transition text-xs"
                      >
                        <Building2 size={13} className="text-gray-400" />
                        Admin Profile
                      </button>
                      <button
                        onClick={() => { setIsDropdownOpen(false); navigate('/admin/register'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-[#1A237E] transition text-xs"
                      >
                        <Plus size={13} className="text-gray-400" />
                        Register Department
                      </button>
                      <button
                        onClick={() => { setIsDropdownOpen(false); navigate('/admin/subscription'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-[#1A237E] transition text-xs"
                      >
                        <ShieldCheck size={13} className="text-gray-400" />
                        Subscription
                      </button>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="py-1.5">
                    <button
                      onClick={() => { setIsDropdownOpen(false); dispatch(logout()); navigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-red-500 hover:bg-red-50 transition text-xs"
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Subscription warning banner ── */}
      {subStatus && !subStatus.noExpiry && (() => {
        const expired = !subStatus.isActive;
        const showCountdown = subCountdown && subCountdown.total > 0 && subCountdown.total < 86400;
        const showExpiredNow = subCountdown && subCountdown.total === 0;
        const warnDays = subStatus.isActive && subStatus.daysLeft <= 7 && !showCountdown;

        if (!expired && !showCountdown && !showExpiredNow && !warnDays) return null;

        return (
          <div className={`flex items-center justify-between px-4 py-1.5 text-xs font-medium
            ${expired || showExpiredNow
              ? 'bg-red-500 text-white'
              : subCountdown && subCountdown.total < 300
              ? 'bg-red-400 text-white animate-pulse'
              : 'bg-orange-400 text-white'}`}>
            <div className="flex items-center gap-2">
              {(expired || showExpiredNow)
                ? <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
                : <Clock className="w-3.5 h-3.5 opacity-80" />}
              {expired
                ? 'Your subscription has expired. Upload an activation file to restore access.'
                : showCountdown
                ? <>Subscription expiring in&nbsp;
                    <span className="font-mono font-bold tracking-wider">
                      {String(subCountdown.h).padStart(2,'0')}:{String(subCountdown.m).padStart(2,'0')}:{String(subCountdown.s).padStart(2,'0')}
                    </span>
                  </>
                : `Subscription expires in ${subStatus.daysLeft} day${subStatus.daysLeft !== 1 ? 's' : ''}. Renew soon.`}
            </div>
            <button onClick={() => navigate('/admin/subscription')}
              className="underline underline-offset-2 opacity-90 hover:opacity-100 whitespace-nowrap ml-4">
              {expired ? 'Activate now →' : 'View details →'}
            </button>
          </div>
        );
      })()}

      <main className="flex-1 overflow-hidden w-full">
        <div className="max-w-[1450px] mx-auto px-4 py-3 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 h-full flex flex-col gap-3 overflow-y-auto pr-1 pb-4" style={{ scrollbarWidth: 'thin' }}>
              {/* Departments Section */}
              <div className="bg-white rounded-lg border border-gray-300 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-1.5 border-b-2 border-[#FF9933]">
                  <h2 className="text-[#1A237E] font-bold text-sm flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> DEPARTMENTS</h2>
                  {departments.length > 10 && (
                    <button
                      onClick={() => setShowAllDepartments((prev) => !prev)}
                      className="text-[#1A237E] text-sm font-medium hover:underline"
                    >
                      {showAllDepartments ? 'Show Less ←' : 'View All →'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {loadingDepartments ? (
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
                          className={`p-2 text-center transition-all rounded-lg border ${selectedDept === dept.name
                            ? "bg-[#1A237E] text-white border-[#FF9933] shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#FF9933] hover:shadow-sm"
                            }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1 ${selectedDept === dept.name ? "text-white" : "text-[#1A237E]"}`} />
                          <p className={`text-[10px] font-bold ${selectedDept === dept.name ? "text-white" : "text-gray-700"}`}>
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
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-4 text-sm focus:border-[#1A237E] focus:outline-none"
                />
              </div>

              {/* Create Task Form */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1A237E]">
                  <div className="w-5 h-5 rounded-full bg-[#FF9933] flex items-center justify-center">
                    <Plus className="w-3 h-3 text-[#1A237E]" />
                  </div>
                  <h3 className="text-white font-bold text-sm tracking-wide">CREATE NEW TASK</h3>
                </div>

                <div className="p-3 b-14 flex flex-col flex-1 gap-2.5">
                  {/* Title */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Task Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="Enter task title..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#1A237E] focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex-1 flex flex-col">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Toolbar */}
                    <div className="flex items-center gap-0.5 border border-gray-200 rounded-t-lg px-2 py-1 bg-gray-50">
                      <button type="button" onClick={toggleBold}
                        className={`p-1 rounded text-gray-600 hover:bg-gray-200 transition ${editor?.isActive('bold') ? 'bg-[#1A237E] text-white' : ''}`}
                        title="Bold">
                        <Bold size={13} />
                      </button>
                      <button type="button" onClick={toggleItalic}
                        className={`p-1 rounded text-gray-600 hover:bg-gray-200 transition ${editor?.isActive('italic') ? 'bg-[#1A237E] text-white' : ''}`}
                        title="Italic">
                        <Italic size={13} />
                      </button>
                      <button type="button" onClick={toggleStrike}
                        className={`p-1 rounded text-gray-600 hover:bg-gray-200 transition ${editor?.isActive('strike') ? 'bg-[#1A237E] text-white' : ''}`}
                        title="Strikethrough">
                        <Type size={13} />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={toggleBulletList}
                        className={`px-1.5 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 transition ${editor?.isActive('bulletList') ? 'bg-[#1A237E] text-white' : ''}`}
                        title="Bullet List">
                        • List
                      </button>
                      <button type="button" onClick={toggleOrderedList}
                        className={`px-1.5 py-1 rounded text-xs text-gray-600 hover:bg-gray-200 transition ${editor?.isActive('orderedList') ? 'bg-[#1A237E] text-white' : ''}`}
                        title="Numbered List">
                        1. List
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button type="button" onClick={triggerFileInput}
                        className="p-1 rounded text-gray-600 hover:bg-gray-200 transition"
                        title="Upload Image">
                        <ImageIcon size={13} />
                      </button>
                    </div>

                    {/* Editor */}
                    <div
                      onDrop={handleImageDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border border-gray-200 border-t-0 rounded-b-lg px-3 py-2 flex-1 cursor-text bg-white text-sm overflow-y-auto"
                      style={{ minHeight: '80px' }}
                      onClick={() => editor?.commands.focus()}
                    >
                      <EditorContent editor={editor} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Drag & drop or click image icon to attach</p>
                    <button
                      onClick={handleAssignTask}
                      disabled={creatingTask}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition ${creatingTask
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1A237E] hover:bg-[#283593]"
                        }`}
                    >
                      {creatingTask ? "Creating..." : <><Plus size={12} /> Create Task</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 h-full flex flex-col gap-3 overflow-hidden pb-4">

              {/* Calendar Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A237E]">
                  <h2 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#FF9933]" />
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }).toUpperCase()} {currentYear}
                  </h2>
                  <button onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="p-1 rounded-md hover:bg-white/20 transition">
                    <CalendarIcon className="w-4 h-4 text-[#FF9933]" />
                  </button>
                </div>
                {isCalendarOpen && (
                  <div className="p-3">
                    <div className="grid grid-cols-7 mb-1">
                      {weekDays.map((day) => (
                        <div key={day.key} className="text-center text-[10px] font-bold text-gray-400 py-1">
                          {day.label}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {calendarDays.map((day, idx) => {
                        const isToday = day.date.toDateString() === new Date().toDateString();
                        const hasTask = tasksAssignedToMyDept.some(
                          (task) => task?.dueDate === day?.date?.toISOString().split("T")[0]
                        );
                        const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                        return (
                          <button key={idx} onClick={() => handleDateClick(day.date)}
                            className={`h-8 w-full rounded-md text-xs font-semibold transition flex flex-col items-center justify-center
                            ${day.isCurrentMonth ? "text-gray-700" : "text-gray-300"}
                            ${isSelected ? "bg-[#1A237E] text-white" : isToday ? "bg-[#FF9933] text-white" : "hover:bg-indigo-50"}`}>
                            {day.date.getDate()}
                            {hasTask && day.isCurrentMonth && !isSelected && (
                              <div className="w-1 h-1 rounded-full bg-[#FF9933] mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Panel — unified with 3 tabs */}
              <div className=" bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Tabs */}
                <div className="  flex border-b border-gray-200">
                  <button onClick={() => setToggleView(1)}
                    className={`flex-1 py-2 text-xs font-semibold transition border-b-2 ${toggleView === 1
                      ? "border-[#1A237E] text-[#1A237E] bg-indigo-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                    <span className="flex items-center justify-center gap-1">
                      <Send className="w-3 h-3" /> Assigned ({tasksISentCount})
                    </span>
                  </button>
                  <div className="w-px bg-gray-200" />
                  <button onClick={() => setToggleView(0)}
                    className={`flex-1 py-2 text-xs font-semibold transition border-b-2 ${toggleView === 0
                      ? "border-[#1A237E] text-[#1A237E] bg-indigo-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                    <span className="flex items-center justify-center gap-1">
                      <Inbox className="w-3 h-3" /> To Me ({pendingCount})
                    </span>
                  </button>
                  {selectedDate && (
                    <>
                      <div className="w-px bg-gray-200" />
                      <button onClick={() => setToggleView(2)}
                        className={`flex-1 py-2 text-xs font-semibold transition border-b-2 relative ${toggleView === 2
                          ? "border-[#FF9933] text-[#1A237E] bg-orange-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                        <span className="flex items-center justify-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {/* Tab: Assigned / To Me */}
                {toggleView !== 2 && (
                  <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {loading ? (
                      <div className="text-center py-8 text-xs text-gray-400">Loading...</div>
                    ) : (toggleView === 1 ? filteredTasksIAssigned : filteredTasksAssignedToMe).length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No tasks found</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {(toggleView === 1 ? filteredTasksIAssigned : filteredTasksAssignedToMe).map((task) => (
                          <div key={task._id} onClick={() => handleTaskClick(task)}
                            className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition group">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-emerald-500" : "bg-orange-400 animate-pulse"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task.title}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {toggleView === 1 ? `→ ${task.assignedTo}` : `← ${task.createdBy}`}
                              </p>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Date Tasks */}
                {toggleView === 2 && selectedDate && (
                  <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {/* Date header row */}
                    <div className="flex items-center justify-between px-3 py-2 bg-orange-50 border-b border-orange-100">
                      <span className="text-xs font-semibold text-[#1A237E]">
                        {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </span>
                      <button onClick={() => { setSelectedDate(null); setToggleView(0); }}
                        className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {dateLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1A237E]" />
                      </div>
                    ) : selectedDateTasks.length === 0 ? (
                      <div className="text-center py-8 text-xs text-gray-400">No tasks for this date</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {selectedDateTasks.map((task) => (
                          <div key={task._id} onClick={() => handleTaskClick(task)}
                            className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition group">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-emerald-500" : "bg-orange-400 animate-pulse"}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                {task.title}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{task.assignedTo} ← {task.createdBy}</p>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-0.5 transition" />
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedDateTasks.length > 0 && (
                      <div className="px-3 py-1.5 border-t bg-gray-50 text-[10px] text-gray-400">
                        {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
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