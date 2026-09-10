"use client";

import { useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/products";

/**
 * Product image gallery: a large main image with a clickable thumbnail strip.
 * Falls back to a single image gracefully.
 */
export default function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  if (list.length === 0) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-black">
        <Image
          key={list[active]}
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        {badge}
      </div>

      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-black transition-colors ${
                i === active ? "border-blood" : "border-line hover:border-blood/50"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="20vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className={`object-cover transition-opacity ${
                  i === active ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
