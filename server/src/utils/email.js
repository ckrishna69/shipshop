import nodemailer from "nodemailer";

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendResetEmail(to, resetLink) {
  if (!transporter) {
    console.log(`[password reset] ${to} -> ${resetLink}`);
    return;
  }
  await transporter.sendMail({
    from: '"Shipshop" <no-reply@shipshop.app>',
    to,
    subject: "Reset your Shipshop password",
    html: `<p>Click below to reset your password. This link expires in 30 minutes.</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
}
