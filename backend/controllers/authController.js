import jwt from 'jsonwebtoken';
import Department from '../models/Department.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log( req.body ," request body of login")

    // Find department by email (lowercase as per schema)
    const department = await Department.findOne({ email: email.toLowerCase() });
    
    if (!department) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if department is active
    if (department.status !== 'active') {
      return res.status(401).json({ 
        success: false,
        message: 'Account is inactive. Please contact admin.' 
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, department.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { 
        id: department._id,
        department: department.department,
        email: department.email,
        role: department.role 
      },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }  // Token expires in 7 days
    );

    // Return response with token
    res.json({
      success: true,
      message: 'Login successful!',
      token: token,
      department: {
        id: department._id,
        department: department.department,
        email: department.email,
        role: department.role,
        phone: department.phone,
        headName: department.headName,
        description: department.description,
        status: department.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error. Please try again later.' 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      department: {
        id: req.department._id,
        name: req.department.name,
        code: req.department.code,
        email: req.department.email,
        role: req.department.role,
        color: req.department.color,
        icon: req.department.icon
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

