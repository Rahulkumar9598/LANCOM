import { Router } from 'express';
import { registerDepartment, getAllDepartments, setServiceAccess } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/isAdmin.js';

const adminRoutes = Router()

adminRoutes.put('/departments/:id/service', protect, adminOnly, setServiceAccess);
adminRoutes.post('/register-department', protect , adminOnly , registerDepartment);
adminRoutes.get('/departments', getAllDepartments);

export default adminRoutes;