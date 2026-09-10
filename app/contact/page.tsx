import type { Metadata } from "next";
import { Mail, Instagram, Music2 } from "lucide-react";
import Prose from "@/components/Prose";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the WALL BUY crew.",
};

export default function ContactPage() {
  return (
    <Prose title="Contact">
      <p>
        Need help with an order, a custom weapon request, or a collab? We usually
        reply within one business day.
      </p>
      <div className="not-prose mt-4 grid gap-3 sm:grid-cols-3">
        <a
          href={`mailto:${SITE.supportEmail}`}
          className="flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-3 text-sm text-bone hover:border-blood/60"
        >
          <Mail className="h-4 w-4 text-blood-bright" /> {SITE.supportEmail}
        </a>
        <a
          href={SITE.socials.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-3 text-sm text-bone hover:border-blood/60"
        >
          <Music2 className="h-4 w-4 text-blood-bright" /> TikTok
        </a>
        <a
          href={SITE.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-3 text-sm text-bone hover:border-blood/60"
        >
          <Instagram className="h-4 w-4 text-blood-bright" /> Instagram
        </a>
      </div>

      <h2>Send us a message</h2>
      <div className="not-prose">
        <ContactForm />
      </div>

      <h2>Business details</h2>
      <p>
        {SITE.company.legalName} · {SITE.company.registration} ·{" "}
        {SITE.company.vat}
        <br />
        {SITE.company.address}, {SITE.company.country}
      </p>
    </Prose>
  );
}
