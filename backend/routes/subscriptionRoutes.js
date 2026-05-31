import express from 'express';
import { protect, protectSkipExpiry } from '../middleware/auth.js';
import { superAdminOnly } from '../middleware/isSuperAdmin.js';
import {
  getPlans,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  generateActivationFile,
  activateLicense,
  getSubscriptionStatus,
  getAllAdminSubscriptions,
  getContactInfo,
  emergencyExtend,
  getAdminHistory,
  getSuperadminHistory,
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Public — anyone can view active plans + contact info
router.get('/plans', getPlans);
router.get('/contact', getContactInfo);

// Admin — these must work even when subscription is expired
router.post('/activate', protectSkipExpiry, activateLicense);
router.get('/status', protectSkipExpiry, getSubscriptionStatus);

// Superadmin only
router.get('/superadmin/plans', protect, superAdminOnly, getAllPlans);
router.post('/superadmin/plans', protect, superAdminOnly, createPlan);
router.put('/superadmin/plans/:id', protect, superAdminOnly, updatePlan);
router.delete('/superadmin/plans/:id', protect, superAdminOnly, deletePlan);
router.post('/superadmin/generate', protect, superAdminOnly, generateActivationFile);
router.get('/superadmin/admins', protect, superAdminOnly, getAllAdminSubscriptions);
router.post('/superadmin/emergency-extend', protect, superAdminOnly, emergencyExtend);
router.get('/superadmin/history', protect, superAdminOnly, getSuperadminHistory);
router.get('/history', protectSkipExpiry, getAdminHistory);

export default router;
