# Booking system setup

Online booking saves each request to a private Google Sheet through a
Google Apps Script web app. The clinic gets an email for every request
and calls the patient to confirm. No WhatsApp, no Resend, no third-party
booking app and no payments.

## One-time setup

1. Create a new Google Sheet owned by the clinic Google account. Name it
   something like "Medcare bookings". Keep it private.
2. Open Extensions, Apps Script. Paste the whole contents of
   `docs/sheets-apps-script.gs` into the script editor and save.
3. In Project Settings, Script properties, add `SECRET` with a long
   random value. This is the shared secret between the website and the
   script; it never appears in browser code.
4. Run `setup()` once from the editor (it creates the Bookings, Slots,
   Holidays and Settings tabs, the Status dropdown and the email
   triggers). Run `sendTestEmail()` to confirm alerts reach the clinic
   inbox.
5. Deploy, New deployment, type "Web app". Execute as Me, access Anyone.
   Copy the web app URL.
6. In Vercel, set these env vars for Production and Preview, then
   redeploy:

   - `SHEETS_WEBHOOK_URL` = the web app URL from step 5
   - `SHEETS_WEBHOOK_SECRET` = the same value as the SECRET script
     property

Both variables are server only. Never expose them as `NEXT_PUBLIC_`
variables and never log them.

## How it works

- The site asks the web app for availability (`action: "availability"`,
  cached server side for 30 seconds) and shows only slots the script
  marks `open`, which already accounts for capacity, holidays and the
  same-day lead time.
- A booking is one `action: "book"` call. The script checks capacity
  under a lock, appends the row and sends an alert email. Full slots,
  duplicates and rate limits are rejected by the script, not the site.

## Alerts

- An email to the clinic for every new request.
- A reminder email for requests still marked New after 45 minutes
  (the `nudgeWaiting` trigger every 30 minutes).
- A daily 8 am email listing today's and tomorrow's requests
  (the `morningDigest` trigger).

Set the alert inbox on the Settings tab under `ClinicEmail`
(comma-separate more than one address).

## The Bookings tab

One row per request. The Status column has a dropdown: New, Confirmed,
Rescheduled, Cancelled, Visited, No-show. Changing it stamps
"Status updated at". Cancelled and Rescheduled free the place back to
the slot; the other statuses keep it held.

## Slots, Holidays, Settings tabs

- Slots: Day, start, end, capacity per hourly slot. Staff edit this to
  change bookable hours. A capacity of 0 blocks the hour.
- Holidays: a date plus a reason closes the day; the strip shows the
  reason and blocks it.
- Settings: `BookingWindowDays` (30), `MinLeadMinutes` (60),
  `MaxPerDay` (150), `MaxPerMobilePer24h` (2), `NudgeAfterMinutes`
  (45), `DigestHour` (8) and the clinic email.

## Changing the script

After editing the script you must deploy again with Manage deployments,
edit the existing deployment and pick a new version, so the web app URL
stays the same and no env var needs updating.

## Local development

With the env vars unset and `NODE_ENV` not production, `getSlots`
returns the clinic's standard slots as open (4 places each) and
`submitBooking` returns a fake success `bk_dev0000`, so the whole flow
can be exercised without a Sheet. In production the same missing env
vars return a failure.
