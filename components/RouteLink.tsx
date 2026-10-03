import Link from "next/link";
import type { ComponentProps } from "react";
import { routeExists } from "@/lib/nav";

/**
 * Link wrapper: disables RSC prefetch for routes that do not exist yet,
 * so unbuilt pages do not 404 their prefetch. All props pass through.
 */
export default function RouteLink({
  href,
  prefetch,
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      prefetch={prefetch ?? (routeExists(String(href)) ? undefined : false)}
      {...rest}
    />
  );
}
