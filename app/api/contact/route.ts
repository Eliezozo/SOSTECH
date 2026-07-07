import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  // Honeypot — should stay empty for real users.
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()]{7,20}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Bot trap: silently accept but do nothing.
  if (body.company && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2 || !EMAIL_RE.test(email) || !PHONE_RE.test(phone) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: SMTP_SECURE ? SMTP_SECURE === "true" : Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const to = CONTACT_TO || SMTP_USER;
  const from = CONTACT_FROM || `Sostech Systems <${SMTP_USER}>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#1a4fa0;border-bottom:2px solid #d4af37;padding-bottom:8px">
        New website inquiry
      </h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;background:#f4f7fc;padding:12px;border-radius:8px">${escapeHtml(
        message
      )}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `Sostech Systems — Website inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
