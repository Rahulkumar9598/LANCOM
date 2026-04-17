import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
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
      from: `"Factory Manager" <${process.env.EMAIL_USER}>`,
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

// Template for OTP email
export const getOTPEmailTemplate = (otp, expiresInMinutes = 10) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1A237E 0%, #283593 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .otp-box {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          border: 2px dashed #1A237E;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #1A237E;
          letter-spacing: 5px;
          font-family: monospace;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #e0e0e0;
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #1A237E;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .warning {
          color: #ff9800;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Factory Manager account.</p>
          
          <div class="otp-box">
            <p style="margin-bottom: 10px; color: #666;">Your One-Time Password (OTP) is:</p>
            <div class="otp-code">${otp}</div>
          </div>
          
          <p>This OTP is valid for <strong>${expiresInMinutes} minutes</strong>.</p>
          <p>If you didn't request this password reset, please ignore this email or contact support.</p>
          
          <div class="warning">
            ⚠️ For security reasons, never share this OTP with anyone.
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 Factory Manager. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for password reset success
export const getPasswordResetSuccessTemplate = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset Successful</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .success-icon {
          font-size: 48px;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #e0e0e0;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Password Reset Successful</h1>
        </div>
        <div class="content">
          <div class="success-icon">🔐</div>
          <p>Hello,</p>
          <p>Your password has been successfully reset.</p>
          <p>You can now login to your account with your new password.</p>
          <p>If you did not perform this action, please contact support immediately.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Factory Manager. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};