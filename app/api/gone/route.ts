// Returns 410 Gone for leftover URLs from the old WordPress site (wp-content, feeds, wp-json…).
// 410 tells Google these are removed for good, so it stops spending crawl budget on them.
export const dynamic = "force-dynamic";

function gone() {
  return new Response(
    "<!doctype html><meta charset=utf-8><title>Page removed</title><h1>This page has been permanently removed.</h1><p><a href=\"/\">Go to the homepage</a></p>",
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}

export const GET = gone;
export const HEAD = gone;
