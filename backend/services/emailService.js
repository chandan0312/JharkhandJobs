import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

export const sendVerificationEmail = async (email, name, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #1B8C0A; margin: 0;">Jharkhand Jobs</h2>
        <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Apna Jharkhand, Apna Career</p>
      </div>
      <h3 style="color: #0F172A;">Welcome to Jharkhand Jobs, ${name}! 👋</h3>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for creating an account with us. Please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyLink}" style="background-color: #1B8C0A; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
          Verify My Email
        </a>
      </div>
      <p style="color: #64748B; font-size: 13px; line-height: 1.5;">
        Or copy and paste this link in your browser:<br/>
        <a href="${verifyLink}" style="color: #2563EB;">${verifyLink}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px; text-align: center;">
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Jharkhand Jobs" <${process.env.EMAIL_USER || 'noreply@jharkhandjobs.com'}>`,
        to: email,
        subject: 'Verify your email - Jharkhand Jobs',
        html,
      });
      console.log(`✉️ Verification email sent to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send verification email to ${email}:`, err.message);
    }
  } else {
    console.log(`\n=============================================================`);
    console.log(`📧 [EMAIL VERIFICATION LINK FOR ${email}]`);
    console.log(`🔗 Link: ${verifyLink}`);
    console.log(`=============================================================\n`);
  }
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #1B8C0A; margin: 0;">Jharkhand Jobs</h2>
        <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Apna Jharkhand, Apna Career</p>
      </div>
      <h3 style="color: #0F172A;">Password Reset Request</h3>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Hello ${name}, we received a request to reset your password for your Jharkhand Jobs account. Click the button below to reset it (valid for 1 hour):
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background-color: #1B8C0A; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748B; font-size: 13px; line-height: 1.5;">
        Or copy and paste this link in your browser:<br/>
        <a href="${resetLink}" style="color: #2563EB;">${resetLink}</a>
      </p>
      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
      <p style="color: #94A3B8; font-size: 12px; text-align: center;">
        If you did not request a password reset, please ignore this email or contact support if you have concerns.
      </p>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Jharkhand Jobs Support" <${process.env.EMAIL_USER || 'support@jharkhandjobs.com'}>`,
        to: email,
        subject: 'Reset your password - Jharkhand Jobs',
        html,
      });
      console.log(`✉️ Password reset email sent to ${email}`);
    } catch (err) {
      console.error(`❌ Failed to send password reset email to ${email}:`, err.message);
    }
  } else {
    console.log(`\n=============================================================`);
    console.log(`🔐 [PASSWORD RESET LINK FOR ${email}]`);
    console.log(`🔗 Link: ${resetLink}`);
    console.log(`=============================================================\n`);
  }
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Jharkhand Jobs Support" <${process.env.EMAIL_USER || 'support@jharkhandjobs.com'}>`,
        to,
        subject,
        html,
        text,
      });
      return true;
    } catch (err) {
      console.error(`Failed to send email to ${to}:`, err.message);
      return false;
    }
  }
  return false;
};
