import Department from '../models/Department.js';
import TimeLog from '../models/TimeLog.js';
import { recordHeartbeat } from '../controllers/subscriptionController.js';

export const tamperCheck = async (req, res, next) => {
  try {
    const dept = req.department;
    if (!dept) return next();

    const now = new Date();

    // 1. Clock rollback detection
    if (dept.lastSeenAt) {
      const lastSeen = new Date(dept.lastSeenAt);
      // Allow 5 min tolerance for minor clock drift
      if (now.getTime() < lastSeen.getTime() - 5 * 60 * 1000) {
        return res.status(403).json({
          success: false,
          message: 'System clock tampering detected. Please restore your system time.',
          code: 'CLOCK_TAMPERED',
        });
      }
    }

    // 2. Check for suspicious time gap (>35 days since last seen — flag but allow)
    if (dept.lastSeenAt) {
      const daysSinceLastSeen = (now - new Date(dept.lastSeenAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSeen > 35) {
        // Log warning but don't block — could be legitimate offline period
        console.warn(`⚠️  ${dept.email} has not been seen for ${Math.floor(daysSinceLastSeen)} days`);
      }
    }

    // 3. Record heartbeat (non-blocking)
    recordHeartbeat(dept._id);

    next();
  } catch (e) {
    next(); // Don't block on errors
  }
};
