"use client";

import { withBasePath } from "@/lib/base-path";
import { motion } from "motion/react";
import { SceneAtmosphere } from "@/components/layout/SceneAtmosphere";
import { Container } from "@/components/ui/Container";
import {
  MailIcon,
  SOCIAL_ICONS,
  WhatsAppIcon,
} from "@/components/ui/ContactIcons";
import { navigation, type NavigationItem } from "@/content/navigation";
import { siteContact } from "@/content/site";
import { cn } from "@/lib/cn";

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;
/** The rows arrive after the curtain has cleared the first of them. */
const ROW_DELAY = 0.16;
const ROW_STEP = 0.05;

type MenuPanelProps = {
  id: string;
  open: boolean;
  reduced: boolean;
  pathname: string;
  onNavigate: () => void;
};

/**
 * The menu: a curtain coming down, carrying one row per route and the two
 * direct channels.
 *
 * The routes are peers, not a sequence, so nothing numbers them. Each takes a
 * full-measure row with its name and what the page holds, which is what gives
 * four names of four different lengths a shape; `.menu-row` in chrome.css
 * carries the rule over each one and the three states it reads in.
 */
export function MenuPanel({
  id,
  open,
  reduced,
  pathname,
  onNavigate,
}: MenuPanelProps) {
  return (
    <motion.div
      id={id}
      role="dialog"
      aria-modal={open}
      aria-label="Menú de navegación"
      data-tone="dark"
      inert={!open}
      initial={false}
      animate={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
      transition={{ duration: reduced ? 0 : 0.75, ease: PANEL_EASE }}
      className={cn(
        "scene-ground fixed inset-0 z-0 flex h-dvh flex-col justify-center overflow-hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* The page's own background, so opening the menu does not change it. */}
      <SceneAtmosphere />

      <Container className="relative pb-10 pt-header">
        <nav aria-label="Principal">
          <ul className="menu-list border-b border-blanco/12">
            {navigation.map((item, index) => (
              <li key={item.id}>
                <MenuRow
                  item={item}
                  /* `trailingSlash` makes the pathname `/ruta/`; the hrefs have none. */
                  current={pathname.replace(/(.)\/$/, "$1") === item.href}
                  open={open}
                  reduced={reduced}
                  index={index}
                  onClick={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>

        <Channels
          open={open}
          reduced={reduced}
          delay={ROW_DELAY + navigation.length * ROW_STEP}
        />
      </Container>
    </motion.div>
  );
}

type MenuRowProps = {
  item: NavigationItem;
  current: boolean;
  open: boolean;
  reduced: boolean;
  index: number;
  onClick: () => void;
};

/**
 * One destination, across the measure: the name, and in a column of its own
 * the clause that says what is there. The two columns give the four rows two
 * vertical lines to hold onto, which four centred names of different widths
 * do not have.
 *
 * `items-baseline` sets the clause on the name's own baseline rather than the
 * top of its box, so a 60px name and a 15px line read as one row.
 */
function MenuRow({
  item,
  current,
  open,
  reduced,
  index,
  onClick,
}: MenuRowProps) {
  return (
    <motion.div
      initial={false}
      animate={{ y: open ? 0 : 28, opacity: open ? 1 : 0 }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced || !open ? 0 : ROW_DELAY + index * ROW_STEP,
        ease: PANEL_EASE,
      }}
    >
      <a
        href={withBasePath(item.href)}
        onClick={onClick}
        data-current={current || undefined}
        aria-current={current ? "page" : undefined}
        /* The columns come from `.menu-list`; what is set here is the row's
           own rhythm and the baseline the clause sits on. */
        className="menu-row group grid gap-y-2 py-5 focus-visible:outline-offset-4 sm:py-6 lg:items-baseline"
      >
        <span className="menu-row_name display-xl">{item.label}</span>
        {/* Flush right, so the clauses stand on the same margin as the close
            button above and the channels below, and the row is used end to
            end. Balanced wrapping is for the narrow end of `lg`, where a
            clause that breaks should give two even lines rather than one long
            and one short. */}
        <span className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-on-detail lg:justify-self-end lg:text-balance lg:text-right">
          {item.summary}
        </span>
      </a>
    </motion.div>
  );
}

/**
 * The two direct channels and the two accounts, on one line under the rows.
 *
 * No call to action over them: the menu is the way around the site, and every
 * page carries its own way in.
 */
function Channels({
  open,
  reduced,
  delay,
}: {
  open: boolean;
  reduced: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ y: open ? 0 : 24, opacity: open ? 1 : 0 }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced || !open ? 0 : delay,
        ease: PANEL_EASE,
      }}
      className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-blanco/12 pt-6 text-sm"
    >
      <a
        href={siteContact.phone.href}
        target="_blank"
        rel="noreferrer"
        className="link-rule inline-flex items-center gap-2 text-on-link hover:text-celeste"
      >
        <WhatsAppIcon className="size-4 shrink-0" />
        {siteContact.phone.label}
      </a>
      <a
        href={siteContact.email.href}
        className="link-rule inline-flex items-center gap-2 text-on-link hover:text-celeste"
      >
        <MailIcon className="size-4 shrink-0" />
        {siteContact.email.label}
      </a>

      <span className="ml-auto flex items-center gap-6">
        {siteContact.social.map((item) => {
          const Icon = SOCIAL_ICONS[item.id];
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="link-rule inline-flex items-center gap-2 text-on-detail hover:text-celeste"
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </span>
    </motion.div>
  );
}
