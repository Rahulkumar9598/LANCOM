import jwt from 'jsonwebtoken';
import Department from '../models/Department.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log(token , ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.department = await Department.findById(decoded.id).select('-password');
      
      if (!req.department) {
        return res.status(401).json({ message: 'Department not found' });
      }
      // Check service expiration
      if (req.department.serviceExpiresAt && new Date(req.department.serviceExpiresAt) < new Date()) {
        return res.status(403).json({ message: 'Service expired. Please purchase subscription.' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};



