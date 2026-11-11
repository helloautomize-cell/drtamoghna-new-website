"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Image as ImageIcon, X } from "lucide-react";
import { formatDayMonth } from "@/lib/format";
import type { VisitingDoctor } from "@/lib/visiting-doctors";

/**
 * "View poster" lightbox (Radix Dialog): focus trapped, Esc and backdrop
 * close, focus returns to the trigger, and the page behind cannot scroll.
 * The poster is a visit announcement image supplied by the clinic, shown
 * whole with its 640w and full-size webp sources and a jpg fallback. Square
 * and portrait posters both fit the viewport (CSS caps height as well as
 * width); the real poster size goes on <img> so there is no layout shift.
 * A caption bar names the doctor under the poster.
 */
export default function PosterLightbox({
  doctor,
  date,
}: {
  doctor: VisitingDoctor;
  date: string;
}) {
  const alt = `Poster: ${doctor.name}, ${doctor.specialty}, ${
    date
      ? `visiting Medcare Bongaigaon on ${formatDayMonth(date)}`
      : "consultations at Medcare Bongaigaon"
  }`;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="btn ghost vd-poster">
          <ImageIcon size={17} strokeWidth={2} aria-hidden /> View poster
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="plb-overlay" />
        <Dialog.Content className="plb">
          <Dialog.Title className="visually-hidden">{alt}</Dialog.Title>
          <picture>
            <source
              srcSet={`${doctor.posterSmall} 640w, ${doctor.poster} ${doctor.posterWidth}w`}
              sizes="(max-width: 600px) calc(100vw - 52px), 536px"
              type="image/webp"
            />
            <img
              src={doctor.posterFallback}
              alt={alt}
              width={doctor.posterWidth}
              height={doctor.posterHeight}
            />
          </picture>
          <Dialog.Description className="plb-cap">
            <b>{doctor.name}</b> {doctor.specialty}
          </Dialog.Description>
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
