export const superAdminOnly = (req, res, next) => {
  // Ensure user is authenticated
  if (!req.department) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Check for superadmin role
  if (req.department.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: `Super admin access required. Your role: ${req.department.role}` });
  }

  next();
};
