import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactPayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const { name, email, subject, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) return null;
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return null;
  if (typeof message !== "string" || message.trim().length === 0) return null;
  if (subject !== undefined && typeof subject !== "string") return null;

  return {
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || undefined,
    message: message.trim(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const payload = parseContactPayload(req.body);
  if (!payload) {
    res.status(400).json({ success: false, error: "Invalid payload" });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    res.status(500).json({ success: false, error: "Server misconfigured" });
    return;
  }

  const subjectLine = payload.subject ? `Kontaktformular: ${payload.subject}` : "Neue Nachricht über das Kontaktformular";

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "marcomannschatz.de", email: "hallo@marcomannschatz.de" },
      to: [{ email: "hallo@marcomannschatz.de", name: "Marco Mannschatz" }],
      replyTo: { email: payload.email, name: payload.name },
      subject: subjectLine,
      textContent: `Name: ${payload.name}\nE-Mail: ${payload.email}\n\n${payload.message}`,
    }),
  });

  if (!brevoRes.ok) {
    res.status(502).json({ success: false, error: "Email provider error" });
    return;
  }

  res.status(200).json({ success: true });
}
