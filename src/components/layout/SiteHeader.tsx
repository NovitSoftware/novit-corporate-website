"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type Lenis from "lenis";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { BarField } from "@/components/decor/BarField";
import { Container } from "@/components/ui/Container";
import {
  MailIcon,
  SOCIAL_ICONS,
  WhatsAppIcon,
} from "@/components/ui/ContactIcons";
import { Logo } from "@/components/ui/Logo";
import { NavItem } from "@/components/ui/NavItem";
import { navigation, siteContact } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** Below this the header always shows; there is nothing to get out of the way of. */
const HIDE_AFTER_PX = 340;

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;

/** The reading ring around the menu button: radius and circumference, in px. */
const RING_RADIUS = 21;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * The logo, and the way into the other sections.
 *
 * The menu is a full-screen curtain coming down — the same gesture as the
 * intro, which lifts one away. It carries one entry per section the site has
 * and nothing else: every destination is a page, so a list of in-page anchors
 * here would be a second index competing with the one the reader is already
 * scrolling. `SiteFooter` is where a page indexes itself.
 *
 * The active entry is the route being read, so the menu says where you are and
 * not only where you can go. That is `usePathname` rather than the scroll-spy
 * this had when every entry was a band of the home page.
 */
export function SiteHeader() {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const openRef = useRef(open);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    openRef.current = open;
    const header = headerRef.current;
    if (header && open) {
      header.dataset.hidden = "false";
    }
  }, [open]);

  /**
   * One scroll subscription drives the read-out: how far down the page we are,
   * and whether the visitor is heading down (header steps aside) or back up
   * (header returns). Written straight to the DOM, so scrolling costs no React
   * renders.
   *
   * Both controls stay white at every scroll position; `data-scrolled` fades a
   * scrim in behind them (see `.site-header` in globals.css) so white holds
   * over a white card without either control changing colour.
   */
  const lenis = useLenis((instance) => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const progress = progressRef.current;
    if (progress) {
      const travelled = RING_LENGTH * (instance.progress || 0);
      progress.style.strokeDashoffset = `${RING_LENGTH - travelled}`;
    }

    header.dataset.scrolled = instance.scroll > 12 ? "true" : "false";
    header.dataset.hidden =
      !openRef.current &&
      instance.direction === 1 &&
      instance.scroll > HIDE_AFTER_PX
        ? "true"
        : "false";
  });

  useMenuAccessibility({ open, close, headerRef, triggerRef, lenis });

  const panelTransition = {
    duration: reduced ? 0 : 0.75,
    ease: PANEL_EASE,
  };

  return (
    <header
      ref={headerRef}
      data-tone="dark"
      data-scrolled="false"
      data-hidden="false"
      className="site-header group/header pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* The menu arrives as a curtain coming down — the same gesture as the
          intro, which lifts one away. */}
      <motion.div
        id={panelId}
        role="dialog"
        aria-modal={open}
        aria-label="Menú de navegación"
        data-tone="dark"
        inert={!open}
        initial={false}
        animate={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        transition={panelTransition}
        className={cn(
          "ground-deep fixed inset-0 z-0 flex h-dvh flex-col justify-center overflow-hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="bloom -left-[8%] top-[-10%] h-[70%] w-[52%] bg-celeste/14" />
          <BarField className="opacity-20" spread={0.8} />
          <div className="bar-grid bar-grid-drift absolute inset-0 opacity-35" />
        </div>

        <Container className="relative grid gap-12 pb-12 pt-header lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-end lg:gap-16">
          <nav aria-label="Principal">
            <ul className="flex flex-col">
              {navigation.map((item, index) => (
                <li key={item.id}>
                  <motion.div
                    initial={false}
                    animate={{ y: open ? 0 : 28, opacity: open ? 1 : 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.6,
                      delay: reduced || !open ? 0 : 0.16 + index * 0.05,
                      ease: PANEL_EASE,
                    }}
                  >
                    <NavItem
                      href={item.href}
                      label={item.label}
                      index={String(index + 1).padStart(2, "0")}
                      size="display"
                      active={pathname === item.href}
                      onClick={close}
                    />
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <motion.div
            initial={false}
            animate={{ y: open ? 0 : 24, opacity: open ? 1 : 0 }}
            transition={{
              duration: reduced ? 0 : 0.6,
              delay: reduced || !open ? 0 : 0.16 + navigation.length * 0.05,
              ease: PANEL_EASE,
            }}
            className="flex flex-col gap-6 border-t border-blanco/12 pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0"
          >
            <p className="max-w-sm text-sm leading-7 text-on-detail">
              Software a medida y agentes de IA integrados. Entendemos el
              proceso, lo construimos con vos y la solución queda siendo tuya.
            </p>
            {/* The direct channels, and no call to action over them: the menu
                is the way around the site, and every page carries its own way
                in. */}
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={siteContact.phone.href}
                target="_blank"
                rel="noreferrer"
                className="link-rule inline-flex w-fit items-center gap-2 text-on-link hover:text-celeste"
              >
                <WhatsAppIcon className="size-4 shrink-0" />
                {siteContact.phone.label}
              </a>
              <a
                href={siteContact.email.href}
                className="link-rule inline-flex w-fit items-center gap-2 text-on-link hover:text-celeste"
              >
                <MailIcon className="size-4 shrink-0" />
                {siteContact.email.label}
              </a>
            </div>
            <div className="flex gap-5">
              {siteContact.social.map((item) => {
                const Icon = SOCIAL_ICONS[item.id];
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-rule inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-on-detail hover:text-celeste"
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </motion.div>

      {/* No bar, no fill, no rule: the page runs under the two controls, which
          are all there is. Pointer events come back on for those alone, so the
          copy passing underneath stays selectable. */}
      <Container
        data-header-rail
        className="relative z-10 flex h-header items-center justify-between"
      >
        <Logo onClick={close} className="pointer-events-auto" />
        <MenuTrigger
          ref={triggerRef}
          progressRef={progressRef}
          open={open}
          panelId={panelId}
          onClick={toggle}
        />
      </Container>
    </header>
  );
}

type MenuTriggerProps = {
  ref: React.Ref<HTMLButtonElement>;
  progressRef: React.Ref<SVGCircleElement>;
  open: boolean;
  panelId: string;
  onClick: () => void;
};

/**
 * The word and the mark together, as the reference has it: a tracked label
 * that names the action, and a round glyph that fills with celeste on hover.
 * The label is the accessible name, so nothing is announced twice.
 *
 * The ring around the glyph is how far down the page the visitor is. With no
 * ground under the header and no scrollbar on the page, it is the only reading
 * indicator left, so it lives on the one control that is always there.
 */
function MenuTrigger({
  ref,
  progressRef,
  open,
  panelId,
  onClick,
}: MenuTriggerProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={onClick}
      className={cn(
        "group/menu pointer-events-auto inline-flex items-center gap-3 text-blanco",
        "focus-visible:outline-offset-4",
      )}
    >
      {/* Both words share one grid cell, so the box is as wide as the longer
          of the two and neither is clipped as they roll through. The label is
          decorative — the button is named above. */}
      <span
        aria-hidden="true"
        className="grid h-4 overflow-hidden text-[0.6875rem] font-bold uppercase leading-4 tracking-[0.2em]"
      >
        <span
          className={cn(
            "col-start-1 row-start-1 transition-transform duration-500 ease-[var(--ease-out-expo)]",
            open ? "-translate-y-full" : "translate-y-0",
          )}
        >
          Menú
        </span>
        <span
          className={cn(
            "col-start-1 row-start-1 text-celeste transition-transform duration-500 ease-[var(--ease-out-expo)]",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          Cerrar
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-full border",
          "transition-[border-color,color] duration-500 ease-[var(--ease-out-expo)]",
          open
            ? "border-celeste text-celeste"
            : "border-blanco/30 group-hover/menu:border-celeste group-hover/menu:text-celeste",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 scale-0 rounded-full bg-celeste/15",
            "transition-transform duration-500 ease-[var(--ease-out-expo)]",
            "group-hover/menu:scale-100 group-focus-visible/menu:scale-100",
          )}
        />
        {/* Reading position, drawn on the button's own edge. */}
        <svg
          viewBox="0 0 44 44"
          className="absolute inset-0 -rotate-90 text-celeste"
          focusable="false"
        >
          <circle
            ref={progressRef}
            cx="22"
            cy="22"
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH}
          />
        </svg>
        <MenuGlyph open={open} />
      </span>
    </button>
  );
}

type MenuAccessibilityOptions = {
  open: boolean;
  close: () => void;
  headerRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  lenis?: Lenis;
};

/**
 * While the menu is open it behaves like a modal: the page underneath does not
 * scroll or take focus, Escape closes it, Tab cycles inside it, and focus
 * returns to the button that opened it.
 *
 * The scroll is held by Lenis rather than by an overflow lock, because the
 * page is scrolled by Lenis in the first place — see `SmoothScroll`.
 */
function useMenuAccessibility({
  open,
  close,
  headerRef,
  triggerRef,
  lenis,
}: MenuAccessibilityOptions) {
  useEffect(() => {
    if (!open) {
      return;
    }

    lenis?.stop();
    const main = document.getElementById("contenido");
    /* `#pie`, not `#contacto`: that anchor belongs to the contact section, and
       the contact section is inside `#contenido`. Looking the footer up by the
       old id would leave the whole footer tabbable behind the open menu. */
    const footer = document.getElementById("pie");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const firstLink =
      headerRef.current?.querySelector<HTMLAnchorElement>("nav a");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab" || !headerRef.current) {
        return;
      }

      const focusable = headerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      lenis?.start();
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, close, headerRef, triggerRef, lenis]);
}

/** The two glyphs rotate through each other rather than swapping on the frame. */
function MenuGlyph({ open }: { open: boolean }) {
  const shared =
    "absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]";

  return (
    <span className="relative block size-5">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          shared,
          open ? "rotate-90 scale-75 opacity-0" : "opacity-100",
        )}
      >
        <path
          d="M4 7h16M4 12h16M4 17h10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          shared,
          open ? "opacity-100" : "-rotate-90 scale-75 opacity-0",
        )}
      >
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    </span>
  );
}
