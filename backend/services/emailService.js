import nodemailer from 'nodemailer';

// Create a transporter
let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'demo@jharkhandjobs.com') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Mock transporter for development and testing
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('========================================');
      console.log('✉️  SIMULATED EMAIL SENT');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log('----------------------------------------');
      console.log(mailOptions.text || mailOptions.html);
      console.log('========================================');
      return { messageId: 'mock-email-id-' + Date.now() };
    }
  };
}

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Jharkhand Jobs Support" <${process.env.EMAIL_USER || 'no-reply@jharkhandjobs.com'}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`[EmailService] Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Error sending email: ${error.message}`);
    return { success: false, error: error.message };
  }
};
