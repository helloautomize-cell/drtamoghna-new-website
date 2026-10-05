"use client";

/* eslint-disable @next/next/no-img-element */
import RouteLink from "@/components/RouteLink";
import { useEffect, useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown, Menu } from "lucide-react";
import { megaMenus, headerLinks } from "@/lib/nav";
import { images, imgSrcSet } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { badgeFile } from "@/lib/service-badges";
import BookButton from "./BookButton";
import MobileMenu from "./MobileMenu";

/**
 * Site header (master-rules 3.1): sticky white, 88px, shrinks to 68px with
 * a glass background after 24px of scroll. Radix NavigationMenu mega menus
 * (120ms hover intent, keyboard and Esc support). Below 1024px a hamburger
 * opens the full-screen MobileMenu sheet.
 */

function MenuDoctorCard() {
  return (
    <div className="mm-doc">
      <img
        src={images.avatar.src}
        srcSet={imgSrcSet(images.avatar)}
        sizes="48px"
        width={48}
        height={48}
        alt={images.avatar.alt}
        loading="lazy"
      />
      <div>
        <p className="mm-doc-name">{siteConfig.doctor.name}</p>
        <p className="mm-doc-line">MD Medicine</p>
        <RouteLink className="mm-doc-link" href="/dr-tamoghna-das/">
          View profile
        </RouteLink>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sitehdr${scrolled ? " is-scrolled" : ""}`}>
      <div className="sitehdr-in container-mc">
        <RouteLink className="sitehdr-logo" href="/" aria-label={`${siteConfig.name}, home`}>
          <img src="/brand/medcare-logo.svg" alt={siteConfig.name} />
        </RouteLink>

        <NavigationMenu.Root className="sitehdr-nav" delayDuration={120}>
          <NavigationMenu.List className="sitehdr-list">
            {megaMenus.map((menu) => (
              <NavigationMenu.Item key={menu.id}>
                <NavigationMenu.Trigger className="sitehdr-trigger">
                  {menu.label}
                  <ChevronDown size={14} strokeWidth={2.2} aria-hidden className="chev" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="sitehdr-content">
                  <div
                    className="mmpanel"
                    style={{ gridTemplateColumns: `${menu.grid} 220px` }}
                  >
                    {menu.columns.map((col) => (
                      <div className="mmcol" key={col.heading}>
                        <p className="mmeyebrow">
                          <img
                            src={badgeFile("doctor", "sm")}
                            width={20}
                            height={20}
                            alt=""
                            aria-hidden
                          />
                          {col.heading}
                        </p>
                        <ul>
                          {col.links.map((link) => (
                            <li key={link.href + link.label}>
                              <NavigationMenu.Link asChild>
                                <RouteLink href={link.href} className="mmlink">
                                  {link.icon ? (
                                    <link.icon size={18} strokeWidth={1.75} aria-hidden />
                                  ) : null}
                                  <span>{link.label}</span>
                                </RouteLink>
                              </NavigationMenu.Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <MenuDoctorCard />
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ))}
            {headerLinks.map((link) => (
              <NavigationMenu.Item key={link.href}>
                <NavigationMenu.Link asChild>
                  <RouteLink className="sitehdr-link" href={link.href}>
                    {link.label}
                  </RouteLink>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          <div className="sitehdr-viewport">
            <NavigationMenu.Viewport className="sitehdr-vp" />
          </div>
        </NavigationMenu.Root>

        <div className="sitehdr-book">
          <BookButton />
        </div>

        <button
          type="button"
          className="sitehdr-burger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={26} strokeWidth={1.8} aria-hidden />
        </button>
      </div>
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  );
}
