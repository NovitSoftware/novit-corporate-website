import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import {
  MailIcon,
  SOCIAL_ICONS,
  WhatsAppIcon,
} from "@/components/ui/ContactIcons";
import { Divider } from "@/components/ui/Divider";
import { Logo } from "@/components/ui/Logo";
import { Scene } from "@/components/motion/Scene";
import { footerContent, site, siteContact } from "@/content/site";
import { cn } from "@/lib/cn";

const footerLink =
  "link-rule inline-flex w-fit items-center gap-2 text-on-link hover:text-celeste";

/**
 * The id is `pie`, not `contacto`. The footer carried that anchor back when
 * the nav's "Redes" item pointed at it and there was no contact section on the
 * page. `ContactSection` owns it now, and two elements answering to one id is
 * invalid markup — the browser jumps to whichever comes first, which was this
 * one, past the form entirely.
 */
export function SiteFooter() {
  return (
    <footer
      id="pie"
      data-tone="dark"
      className="relative scroll-mt-anchor overflow-hidden py-16 text-blanco sm:py-20"
    >
      {/* Nothing here can be scrolled further up once the page bottoms out, so
          the footer reveals as it enters rather than at 82% of the viewport. */}
      <Scene className="relative" start="top bottom">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div data-anim-block>
              <div data-anim="rise">
                <Logo />
              </div>
              <div
                data-anim="bar"
                aria-hidden="true"
                className="hairline mt-7 w-24"
              />
              <p
                data-anim="rise"
                className="mt-5 max-w-[var(--measure)] text-sm leading-7 text-on-detail"
              >
                {footerContent.mission}
              </p>
              <div data-anim="rise" className="mt-7">
                <ChipButton href={footerContent.contact.href} variant="light">
                  {footerContent.contact.value}
                </ChipButton>
              </div>
              {/* Direct channels, under the CTA rather than replacing it: the
                  chip starts a conversation on this page, these are for
                  someone who already knows what they want to say. */}
              <div
                data-anim="rise"
                className="mt-6 flex flex-col gap-2 text-sm"
              >
                <a
                  href={siteContact.phone.href}
                  target="_blank"
                  rel="noreferrer"
                  className={footerLink}
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                  {siteContact.phone.label}
                </a>
                <a href={siteContact.email.href} className={footerLink}>
                  <MailIcon className="size-4 shrink-0" />
                  {siteContact.email.label}
                </a>
              </div>
            </div>
            {footerContent.columns.map((column) => (
              <nav key={column.title} aria-label={column.title} data-anim-block>
                <p
                  data-anim="wipe"
                  className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-celeste"
                >
                  {column.title}
                </p>
                <ul data-anim="rise" className="mt-4 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={cn(footerLink, "text-sm")}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <Divider tone="dark" className="my-10" />

          {/* `legal` is still empty — those links pointed at an in-page
              section rather than at policies that exist, and none are
              written yet. `social` is not: Instagram and LinkedIn are both
              live and linked from novitsoftware.com's own header. */}
          {footerContent.legal.length + footerContent.social.length > 0 ? (
            <div
              data-anim="rise"
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-detail"
            >
              {footerContent.legal.map((item) => (
                <a key={item.label} href={item.href} className={footerLink}>
                  {item.label}
                </a>
              ))}
              {footerContent.social.map((item) => {
                const Icon = SOCIAL_ICONS[item.id];
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={footerLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          ) : null}

          <p
            data-anim="fade"
            className="mt-8 text-xs uppercase tracking-[0.16em] text-blanco/50"
          >
            © {site.copyrightYear} {site.name}
          </p>
        </Container>
      </Scene>
    </footer>
  );
}
