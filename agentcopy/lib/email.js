import { Resend } from 'resend';
import { APP_URL } from './config.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || 'AgentCopy <noreply@agentcopy.co.nz>';

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your AgentCopy password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1A1A18;">Reset your password</h2>
        <p>We received a request to reset your AgentCopy password. Click the link below to choose a new one.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="background: #2D5A3D; color: white; padding: 12px 24px; border-radius: 8px;
                    text-decoration: none; font-weight: 600; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">AgentCopy · AI writing for NZ real estate agents</p>
      </div>
    `,
  });
}
