"use client";

import { useState } from "react";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { FormField } from "../_components/FormField";
import { ReadingPanel } from "@/components/section/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Section } from "@/components/section/Section";
import { SectionLabel } from "@/components/section/SectionLabel";
import { closingContent } from "@/content/home";
import { siteContact } from "@/content/site";

const PREFIX = "contact";

const encode = encodeURIComponent;

/** Where each link hands the message: a chat with the line, or a mail to the
 *  inbox, opened with the message already written — or with nothing written,
 *  when the box is empty, rather than not at all. */
const CHANNELS = [
  {
    id: "whatsapp",
    label: closingContent.send.whatsapp,
    Icon: WhatsAppIcon,
    href: (message: string) => (message ? `${siteContact.phone.href}?text=${encode(message)}` : siteContact.phone.href),
    external: true,
  },
  {
    id: "email",
    label: closingContent.send.email,
    Icon: MailIcon,
    href: (message: string) =>
      `${siteContact.email.href}?subject=${encode(closingContent.subject)}${message ? `&body=${encode(message)}` : ""}`,
    external: false,
  },
] as const;

/**
 * El cierre, and the message it asks for. It is the last band on the page, so
 * the statement of the ask and the ask itself are one section.
 *
 * There is no endpoint, so there is no submit: the two sends are links, and
 * their hrefs are rebuilt from the box as it is typed in — WhatsApp in a new
 * tab, the inbox in the mail client, with the message written, for the visitor
 * to send from there. Links rather than buttons that open a window from a
 * script: they need nothing to have run first, so they work before the page
 * has hydrated, and they are never refused — an earlier version held the
 * message to ten characters, and a "hola" did nothing but show an error.
 */
export function ContactSection() {
  const [message, setMessage] = useState("");
  const text = message.trim();

  return (
    <Section id={closingContent.id}>
      <Scene>
        <Container>
          {/* The ask beside the form, not above it: ~450px of copy against a
              ~600px form. `items-start` is load-bearing — a stretched grid
              item fills its row and has no slack to stick within. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
            <div
              data-anim-block
              className="grid gap-y-9 lg:sticky lg:top-[calc(var(--header-height)+4rem)]"
            >
              <SectionLabel
                index={closingContent.index}
                name={closingContent.eyebrow}
                icon={closingContent.icon}
              />
              <div>
                {/* The volanta, with the accent on the half the reference
                    sets in bold — at this size weight is already maxed, so
                    colour is what carries the emphasis. */}
                <p data-anim="chip" className="eyebrow text-on-eyebrow">
                  {closingContent.kicker.lead}{" "}
                  <span className="text-celeste">
                    {closingContent.kicker.strong}
                  </span>
                </p>
                <ScrollWords
                  as="h2"
                  text={closingContent.title}
                  className="display-xl mt-5 max-w-[24ch] text-blanco"
                />
                <p
                  data-anim="rise"
                  className="mt-7 max-w-[42ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
                >
                  {closingContent.description}
                </p>
              </div>
            </div>

            <ReadingPanel as="div">
              <div className="space-y-6">
                <FormField
                  prefix={PREFIX}
                  name="message"
                  label={closingContent.message.label}
                  icon={closingContent.message.icon}
                  placeholder={closingContent.message.placeholder}
                  value={message}
                  onChange={setMessage}
                />

                <div className="flex flex-wrap gap-3">
                  {CHANNELS.map(({ id, label, Icon, href, external }) => (
                    <ChipButton
                      key={id}
                      href={href(text)}
                      variant="dark"
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="size-3.5 shrink-0" />
                        {label}
                      </span>
                    </ChipButton>
                  ))}
                </div>
              </div>
            </ReadingPanel>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
