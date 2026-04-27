import nodemailer from "nodemailer";
import { getAppEnv } from "@/lib/env";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendLmsMail(options: MailOptions) {
  const env = getAppEnv();

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass || !env.smtpFrom) {
    console.info(`[LMS] Email not sent because SMTP is not configured. Subject: ${options.subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
