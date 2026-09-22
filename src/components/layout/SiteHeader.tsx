"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MenuPanel } from "@/components/layout/MenuPanel";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** Below this the header always shows; there is nothing to get out of the way of. */
const HIDE_AFTER_PX = 340;

/** The reading ring around the menu button: radius and circumference, in px. */
const RING_RADIUS = 21;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * The logo, the menu button, and the curtain the button opens.
 *
 * The rows themselves are `MenuPanel`; what is left here is the header's own
 * chrome and the modal behaviour around the panel. The active row is the route
 * being read, so the menu says where you are and not only where you can go.
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
   * scrim in behind them (see `.site-header` in chrome.css) so white holds over
   * a white card without either control changing colour.
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

  return (
    <header
      ref={headerRef}
      data-tone="dark"
      data-scrolled="false"
      data-hidden="false"
      className="site-header group/header pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      <MenuPanel
        id={panelId}
        open={open}
        reduced={reduced}
        pathname={pathname}
        onNavigate={close}
      />

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
 * The word and the mark together: a tracked label that names the action, and a
 * round glyph that fills with celeste on hover. The label is the accessible
 * name, so nothing is announced twice.
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
