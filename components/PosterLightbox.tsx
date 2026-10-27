"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Image as ImageIcon, X } from "lucide-react";
import { formatDayMonth } from "@/lib/format";
import type { VisitingDoctor } from "@/lib/visiting-doctors";

/**
 * "View poster" lightbox (Radix Dialog): focus trapped, Esc and backdrop
 * close, focus returns to the trigger. The poster is a visit announcement
 * image supplied by the clinic, shown with its 640w/1200w webp sources and
 * a jpg fallback.
 */
export default function PosterLightbox({
  doctor,
  date,
}: {
  doctor: VisitingDoctor;
  date: string;
}) {
  const alt = `Poster: ${doctor.name}, ${doctor.specialty}, visiting Medcare Bongaigaon${
    date ? ` on ${formatDayMonth(date)}` : ""
  }`;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="vd-poster">
          <ImageIcon size={17} strokeWidth={2} aria-hidden /> View poster
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="plb-overlay" />
        <Dialog.Content className="plb">
          <Dialog.Title className="visually-hidden">{alt}</Dialog.Title>
          <picture>
            <source
              srcSet={`${doctor.posterSmall} 640w, ${doctor.poster} 1200w`}
              sizes="(max-width: 600px) calc(100vw - 52px), 536px"
              type="image/webp"
            />
            <img
              src={doctor.posterFallback}
              alt={alt}
              width={1200}
              height={1200}
            />
          </picture>
          <Dialog.Close asChild>
            <button type="button" className="plb-close" aria-label="Close poster">
              <X size={22} strokeWidth={2} aria-hidden />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
