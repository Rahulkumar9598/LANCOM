import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Lancom" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// OTP Email Template
export const getOTPEmailTemplate = (otp, expiresInMinutes = 10) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset OTP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
        .header { background: #1A237E; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #1A237E; letter-spacing: 5px; background: white; padding: 15px; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔐 Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Your OTP for password reset is:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP is valid for <strong>${expiresInMinutes} minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Lancom. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password Reset Success Template
export const getPasswordResetSuccessTemplate = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset Successful</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; text-align: center; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Password Reset Successful</h2>
        </div>
        <div class="content">
          <p>Your password has been successfully reset.</p>
          <p>You can now login with your new password.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Lancom. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};