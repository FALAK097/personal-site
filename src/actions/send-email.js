"use server";

import nodemailer from "nodemailer";
import { z } from "zod";
import { incrementRateLimit } from "@/lib/site-data-store";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 3;

export async function sendContactEmail(formData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = formSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { name, email, subject, message } = parsed.data;

  const rateLimitKey = `rate_limit:contact:${email}`;
  const attempts = await incrementRateLimit(
    rateLimitKey,
    RATE_LIMIT_WINDOW_SECONDS
  );

  if (attempts > RATE_LIMIT_MAX) {
    return { success: false, error: "Too many requests. Try again later." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `[Portfolio] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: "Email failed to send." };
  }
}
