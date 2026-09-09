import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Story",
  description: "Why WALL BUY exists — neon wall-buys for the Zombies faithful.",
};

export default function AboutPage() {
  return (
    <Prose title="The Story">
      <p>
        WALL BUY started with a simple idea: the weapons you slap off the wall
        every round deserve a spot on your <em>real</em> wall. We build LED neon
        art inspired by the wall-buys and Wonder Weapons that defined countless
        late-night runs.
      </p>
      <h2>Hand-built, not mass-printed</h2>
      <p>
        Every piece is shaped from flexible LED neon on a matte-black acrylic
        panel, wired for a remote dimmer and ready to mount straight out of the
        box. No flimsy stickers, no cheap prints — just glow.
      </p>
      <h2>Built with the community</h2>
      <p>
        We drop new weapons based on what our TikTok community asks for. Comment
        the weapon you want next and it might be the next one on the wall.
      </p>
      <p>
        Questions, collabs or wholesale? Reach us at{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
      <p className="text-xs">
        WALL BUY is an independent maker and is not affiliated with or endorsed by
        Activision. All designs are original neon interpretations.
      </p>
    </Prose>
  );
}
