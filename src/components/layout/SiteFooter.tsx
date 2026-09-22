import { ChipButton } from "@/shared/ui/ChipButton";
import { Container } from "@/shared/ui/Container";
import {
  MailIcon,
  SOCIAL_ICONS,
  WhatsAppIcon,
} from "@/shared/ui/ContactIcons";
import { Divider } from "@/shared/ui/Divider";
import { Logo } from "@/shared/ui/Logo";
import { Scene } from "@/shared/motion/Scene";
import { site } from "@/shared/content/site";
import { type FooterContent } from "@/shared/content/footer";
import { cn } from "@/shared/lib/cn";

const footerLink =
  "link-rule inline-flex w-fit items-center gap-2 text-on-link hover:text-celeste";

/** The glyph each direct channel gets, keyed off the `id` the content sets. */
const CHANNEL_ICONS = {
  whatsapp: WhatsAppIcon,
  email: MailIcon,
} as const;

/**
 * The id is `pie`, not `contacto`. The footer carried that anchor back when
 * the nav's "Redes" item pointed at it and there was no contact section on the
 * page. `ContactSection` owns it now, and two elements answering to one id is
 * invalid markup — the browser jumps to whichever comes first, which was this
 * one, past the form entirely.
 *
 * `content` is how a route gives the footer its own index, and there is no
 * default: a footer listing Nosotros, Casos and the AI page under a course is
 * a way out of that page rather than a map of it, so each route names its own
 * beside its own content.
 */
export function SiteFooter({ content }: { content: FooterContent }) {
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
          {/* One track per column the route actually has. The three-up
              template leaves an empty third of the measure under a footer that
              indexes a single thing. */}
          <div
            className={cn(
              "grid gap-12",
              content.columns.length > 1
                ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]"
                : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]",
            )}
          >
            <div data-anim-block>
              <div data-anim="rise">
                <Logo />
              </div>
              <div
                data-anim="bar"
                aria-hidden="true"
                className="hairline mt-7 w-24"
              />
              {content.mission ? (
                <p
                  data-anim="rise"
                  className="mt-5 max-w-[var(--measure)] text-sm leading-7 text-on-detail"
                >
                  {content.mission}
                </p>
              ) : null}
              <div data-anim="rise" className="mt-7">
                {/* A route whose way in is WhatsApp points off-site, so the
                    chip opens like the channels under it do. */}
                <ChipButton
                  href={content.contact.href}
                  variant="light"
                  target={
                    content.contact.href.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    content.contact.href.startsWith("http")
                      ? "noreferrer"
                      : undefined
                  }
                >
                  {content.contact.value}
                </ChipButton>
              </div>
              {/* Direct channels, under the CTA rather than replacing it: the
                  chip starts a conversation on this page, these are for
                  someone who already knows what they want to say. */}
              <div
                data-anim="rise"
                className="mt-6 flex flex-col gap-2 text-sm"
              >
                {content.channels.map((channel) => {
                  const ChannelIcon = CHANNEL_ICONS[channel.id];
                  const external = channel.href.startsWith("http");

                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className={footerLink}
                    >
                      <ChannelIcon className="size-4 shrink-0" />
                      {channel.label}
                    </a>
                  );
                })}
              </div>
            </div>
            {content.columns.map((column) => (
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
                      {/* No `href` means it is a fact, not a destination —
                          the edition's dates on `/academianovit`. An anchor
                          with nowhere to go is a link that lies. */}
                      {link.href ? (
                        <a
                          href={link.href}
                          className={cn(footerLink, "text-sm")}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <span className="text-sm text-on-detail">
                          {link.label}
                        </span>
                      )}
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
          {content.legal.length + content.social.length > 0 ? (
            <div
              data-anim="rise"
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-detail"
            >
              {content.legal.map((item) => (
                <a key={item.label} href={item.href} className={footerLink}>
                  {item.label}
                </a>
              ))}
              {content.social.map((item) => {
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
