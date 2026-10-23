import { siteConfig } from "./site-config";

/**
 * whatsapp.ts · Single source for the WhatsApp pre-fill.
 * One message for every WhatsApp button on the site.
 */
export const WHATSAPP_MESSAGE =
  "Hello Medcare\nI'd like to book an appointment with Dr. Tamoghna Das.";

export function whatsappMessage(): string {
  return WHATSAPP_MESSAGE;
}

export function whatsappUrl(
  wa: string = siteConfig.whatsapp.numbers[0].wa,
): string {
  return `https://wa.me/${wa}?text=${encodeURIComponent(whatsappMessage())}`;
}
