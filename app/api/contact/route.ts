import { NextRequest, NextResponse } from "next/server";
import {
  getResend,
  isEmailConfigured,
  isValidEmail,
  EMAIL_FROM,
} from "@/lib/email";
import { SITE } from "@/lib/site";

export async function POST(req: NextRequest) {
  if (!isEmailConfigured) {
    return NextResponse.json(
      {
        error: `Messaging isn't switched on yet — email us directly at ${SITE.supportEmail}.`,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    !isValidEmail(email) ||
    typeof message !== "string" ||
    message.trim().length < 5
  ) {
    return NextResponse.json(
      { error: "Please fill in your name, a valid email and a message." },
      { status: 400 },
    );
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Not available." }, { status: 503 });
  }

  const clean = (s: string) => s.slice(0, 5000);

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: SITE.supportEmail,
      replyTo: email,
      subject: `Contact form — ${clean(name)}`,
      text: `From: ${clean(name)} <${email}>\n\n${clean(message)}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}
