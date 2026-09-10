import { NextRequest, NextResponse } from "next/server";
import {
  getResend,
  isEmailConfigured,
  isValidEmail,
  EMAIL_FROM,
  AUDIENCE_ID,
} from "@/lib/email";
import { SITE } from "@/lib/site";

export async function POST(req: NextRequest) {
  if (!isEmailConfigured) {
    return NextResponse.json(
      { error: "The newsletter isn't switched on yet. Check back soon!" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Not available." }, { status: 503 });
  }

  try {
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    } else {
      // No audience configured — notify support so the signup isn't lost.
      await resend.emails.send({
        from: EMAIL_FROM,
        to: SITE.supportEmail,
        subject: "New newsletter signup",
        text: `New subscriber: ${email}`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error", err);
    return NextResponse.json(
      { error: "Could not sign you up. Please try again." },
      { status: 500 },
    );
  }
}
