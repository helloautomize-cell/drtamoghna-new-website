"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { COOKIE_SETTINGS_EVENT, setConsent, useConsent } from "@/lib/consent";
import { useMounted } from "@/lib/useMounted";

/**
 * Cookie banner (master-rules 3.1): small glass card, bottom left, above the
 * mobile action bar on mobile. Accept / Decline / Settings; Settings opens a
 * dialog with Essential (always on) and Analytics toggles. No analytics code
 * exists yet; the choice is stored by lib/consent.ts.
 */
export default function CookieBanner() {
  const consent = useConsent();
  const mounted = useMounted();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // Footer "Cookie settings" link re-opens the dialog.
  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  if (!mounted) return null;

  const showBanner = consent === null;

  const saveSettings = () => setConsent(analytics);

  return (
    <>
      {showBanner ? (
        <div className="cookie" role="region" aria-label="Cookie consent">
          <p>
            We use essential cookies to run this site. With your permission we also use analytics
            to see which pages help patients.
          </p>
          <div className="cookie-btns">
            <button type="button" className="cookie-accept" onClick={() => setConsent(true)}>
              Accept
            </button>
            <button type="button" className="cookie-decline" onClick={() => setConsent(false)}>
              Decline
            </button>
            <button type="button" className="cookie-settings" onClick={() => setSettingsOpen(true)}>
              Settings
            </button>
          </div>
        </div>
      ) : null}

      <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="cdlg-overlay" />
          <Dialog.Content className="cdlg" aria-label="Cookie settings">
            <Dialog.Title className="cdlg-title">Cookie settings</Dialog.Title>
            <Dialog.Description className="cdlg-desc">
              Choose which cookies this site may use.
            </Dialog.Description>
            <div className="cdlg-row">
              <div>
                <p className="cdlg-name">Essential</p>
                <p className="cdlg-note">Needed for the site to work. Always on.</p>
              </div>
              <input type="checkbox" checked disabled aria-label="Essential cookies, always on" />
            </div>
            <div className="cdlg-row">
              <div>
                <p className="cdlg-name">Analytics</p>
                <p className="cdlg-note">Anonymous page statistics to see what helps patients.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="Analytics cookies"
              />
            </div>
            <div className="cdlg-btns">
              <button
                type="button"
                className="cookie-accept"
                onClick={() => {
                  saveSettings();
                  setSettingsOpen(false);
                }}
              >
                Save settings
              </button>
              <Dialog.Close asChild>
                <button type="button" className="cookie-settings">
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
