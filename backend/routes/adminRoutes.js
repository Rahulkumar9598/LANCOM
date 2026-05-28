import { Router } from 'express';
import { registerDepartment, getAllDepartments, setServiceAccess, getAllAdmins, updateAdminStatus } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/isAdmin.js';
import { superAdminOnly } from '../middleware/isSuperAdmin.js';

const adminRoutes = Router()

adminRoutes.put('/departments/:id/service', protect, adminOnly, setServiceAccess);
adminRoutes.post('/register-department', protect, adminOnly, registerDepartment);
adminRoutes.get('/departments', protect, adminOnly, getAllDepartments);

// Super admin routes
adminRoutes.get('/admins', protect, superAdminOnly, getAllAdmins);
adminRoutes.patch('/admins/:id/status', protect, superAdminOnly, updateAdminStatus);

export default adminRoutes;