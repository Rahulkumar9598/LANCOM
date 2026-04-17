import express from 'express';
import { protect } from '../middleware/auth.js';
import {createTask, getTasksAssignedToMe, getTasksByDate, getTasksCreatedByMe, handleGetAllDepartment, markCompleteTask, uploadImage} from '../controllers/taskController.js';
import { departmentOnly } from '../middleware/deparmentOnly.js';
import { upload } from '../middleware/uploadMiddleware.js';

const taskRoutes = express.Router();


taskRoutes.post("/upload-image", protect, departmentOnly, upload.single("image"), uploadImage);

taskRoutes.post("/create-new-task",protect,departmentOnly , createTask)

taskRoutes.get("/get-tasks-assigned-to-me", protect , getTasksAssignedToMe),
taskRoutes.get("/get-tasks-created-by-me",protect , departmentOnly , getTasksCreatedByMe)
taskRoutes.get('/by-date/:date', protect, departmentOnly, getTasksByDate);
taskRoutes.post("/mark-complete-task" ,protect , departmentOnly , markCompleteTask)
taskRoutes.post("/get-all-department" , protect , departmentOnly , handleGetAllDepartment)

export default taskRoutes;