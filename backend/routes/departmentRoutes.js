import { Router } from 'express';
import { addEmployee, getEmployees } from '../controllers/employeeController.js';
import { protect } from '../middleware/auth.js';
import { getDepartments } from '../controllers/departmentController.js';

const departmentRoutes = Router();

departmentRoutes.get('/', protect, getDepartments);
departmentRoutes.post('/employee', protect, addEmployee);
departmentRoutes.get('/employee', protect, getEmployees);

// Get current department info
departmentRoutes.get('/me', protect, (req, res) => {
  res.json({ success: true, department: req.department });
});
export default departmentRoutes;