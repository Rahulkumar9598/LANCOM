import jwt from 'jsonwebtoken';
import Department from '../models/Department.js';
import bcrypt from 'bcryptjs';
import { getOTPEmailTemplate, getPasswordResetSuccessTemplate, sendEmail } from '../utils/emailService.js';

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



// OTP Storage (temporary - in production use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await Department.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    const otp = generateOTP();
    
    otpStore.set(email.toLowerCase(), {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false,
      attempts: 0
    });

    console.log(otp , " this is my controller")
    
    const emailTemplate = getOTPEmailTemplate(otp, 10);
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

// ==================== VERIFY OTP ====================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedData = otpStore.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP'
      });
    }

    if (storedData.attempts >= 5) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP'
      });
    }

    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - storedData.attempts} attempts remaining`
      });
    }

    storedData.verified = true;

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const storedData = otpStore.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP'
      });
    }

    if (!storedData.verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first'
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    const user = await Department.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    otpStore.delete(email.toLowerCase());

    const successTemplate = getPasswordResetSuccessTemplate();
    await sendEmail(email, 'Password Reset Successful', successTemplate);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// Cleanup expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
  console.log('🧹 Cleaned up expired OTPs');
}, 10 * 60 * 1000);