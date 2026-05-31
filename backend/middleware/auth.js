import jwt from 'jsonwebtoken';
import Department from '../models/Department.js';
import { recordHeartbeat } from '../controllers/subscriptionController.js';

// Same as protect but skips the service expiry check — used for subscription status/activate routes
export const protectSkipExpiry = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer')) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.department = await Department.findById(decoded.id).select('-password');
    if (!req.department) return res.status(401).json({ message: 'Department not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.department = await Department.findById(decoded.id).select('-password');

      if (!req.department) {
        return res.status(401).json({ message: 'Department not found' });
      }

      // ── Clock rollback detection ──────────────────────────────────────────
      const now = new Date();
      if (req.department.lastSeenAt) {
        const lastSeen = new Date(req.department.lastSeenAt);
        if (now.getTime() < lastSeen.getTime() - 5 * 60 * 1000) {
          return res.status(403).json({
            success: false,
            message: 'System clock tampering detected. Please restore your system time.',
            code: 'CLOCK_TAMPERED',
          });
        }
      }

      // ── Service expiration check ──────────────────────────────────────────
      if (req.department.serviceExpiresAt && new Date(req.department.serviceExpiresAt) < now) {
        return res.status(403).json({
          success: false,
          message: 'Service expired. Please activate your subscription.',
          code: 'SERVICE_EXPIRED',
        });
      }

      // ── Record heartbeat (non-blocking) ───────────────────────────────────
      recordHeartbeat(req.department._id);

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};



