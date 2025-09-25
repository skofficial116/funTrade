import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

// Load environment variables
dotenv.config();

// Configure SendGrid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
const appName = process.env.APP_NAME || 'FunTrade';

if (!sendgridApiKey) {
  console.error('❌ SENDGRID_API_KEY is not set in environment variables');
  process.exit(1);
}

if (!fromEmail) {
  console.error('❌ SENDGRID_FROM_EMAIL is not set in environment variables');
  process.exit(1);
}

// Configure SendGrid
sgMail.setApiKey(sendgridApiKey);

// Test email function
async function sendTestEmail() {
  const testEmail = process.argv[2] || fromEmail;
  
  console.log(`\n📧 Sending test email to: ${testEmail}`);
  
  const msg = {
    to: testEmail,
    from: `"${appName}" <${fromEmail}>`,
    subject: 'Test Email from FunTrade',
    text: 'This is a test email from FunTrade to verify SendGrid configuration.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Test Email from ${appName}</h2>
        <p>This is a test email to verify that your SendGrid configuration is working correctly.</p>
        <p>If you're seeing this email, everything is set up correctly! 🎉</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ Email sent successfully!');
    console.log('Status Code:', response[0].statusCode);
    console.log('Headers:', response[0].headers);
    return true;
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    return false;
  }
}

// Run the test
sendTestEmail().then(success => {
  process.exit(success ? 0 : 1);
});
