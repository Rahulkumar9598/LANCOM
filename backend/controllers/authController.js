import jwt from 'jsonwebtoken';
import Department from '../models/Department.js';
import bcrypt from 'bcryptjs';
import { getOTPEmailTemplate, sendEmail } from '../utils/emailService.js';

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists in Department model
    const user = await Department.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    otpStore[email.toLowerCase()] = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      verified: false,
      attempts: 0
    };

    // Get email template
    const emailTemplate = getOTPEmailTemplate(otp, 10);
    
    // Send OTP email using your emailService
    const emailSent = await sendEmail(email, 'Password Reset OTP', emailTemplate);

    if (!emailSent.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};