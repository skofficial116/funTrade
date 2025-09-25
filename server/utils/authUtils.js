import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configure nodemailer with your email service
console.log('Initializing email service...');
console.log('Email Service:', process.env.EMAIL_SERVICE || 'gmail (default)');
console.log('Email User:', process.env.EMAIL_USER ? 'Configured' : 'NOT CONFIGURED');
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '******' : 'NOT CONFIGURED');

// Verify email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email service configuration is incomplete. Please check your .env file.');
  console.error('Required environment variables:');
  console.error('- EMAIL_USER: Your email address');
  console.error('- EMAIL_PASSWORD: Your email password or app password');
  if (process.env.EMAIL_SERVICE === 'gmail') {
    console.error('\nFor Gmail, you might need to:');
    console.error('1. Enable 2-factor authentication');
    console.error('2. Generate an App Password: https://myaccount.google.com/apppasswords');
    console.error('3. Use the App Password instead of your regular password');
  }
}

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email service connection failed:', error);
    console.error('Please check your email configuration and internet connection.');
  } else {
    console.log('✅ Email service is ready to send messages');
    console.log(`Service: ${process.env.EMAIL_SERVICE || 'gmail (default)'}`);
    console.log(`From: ${process.env.EMAIL_USER}`);
  }
});

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with OTP
export const sendVerificationEmail = async (email, otp) => {
  console.log(`\n📧 Preparing to send verification email to: ${email}`);
  console.log(`OTP: ${otp} (valid for 10 minutes)`);
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background: #f4f4f4; padding: 10px; font-size: 24px; letter-spacing: 5px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  console.log(`\n📧 Preparing to send password reset email to: ${email}`);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log(`Reset URL: ${resetUrl}`);
  
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Generate a random token for password reset
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
