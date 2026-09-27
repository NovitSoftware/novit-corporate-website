"use client";

import { useState, type FormEvent } from "react";
import { ChipArrow } from "@/components/ui/ChipButton";
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
import { fieldId, firstInvalid, validateFields, type FieldErrors, type FieldRules } from "../_lib/form";

const PREFIX = "contact";

const RULES: FieldRules<"message"> = {
  message: { min: 10, message: closingContent.message.error },
};

/** Where each button hands the message: a chat with the line, or a mail to
 *  the inbox, opened with the message already written. */
const CHANNELS = [
  {
    id: "whatsapp",
    label: closingContent.send.whatsapp,
    Icon: WhatsAppIcon,
    href: (message: string) => `${siteContact.phone.href}?text=${encodeURIComponent(message)}`,
  },
  {
    id: "email",
    label: closingContent.send.email,
    Icon: MailIcon,
    href: (message: string) =>
      `${siteContact.email.href}?subject=${encodeURIComponent(closingContent.subject)}&body=${encodeURIComponent(message)}`,
  },
] as const;

/**
 * El cierre, and the form it asks for. It is the last band on the page, so the
 * statement of the ask and the ask itself are one section.
 *
 * The form holds the message and nothing else, and it has no endpoint: each
 * button opens its channel — WhatsApp in a new tab, the inbox in the mail
 * client — with the message written, for the visitor to send from there.
 * Validation runs on submit, not on every keystroke: a box that turns red
 * while someone is still typing is telling them they are wrong when they are
 * simply not finished.
 */
export function ContactSection() {
  const [errors, setErrors] = useState<FieldErrors<"message">>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const next = validateFields(RULES, data);
    setErrors(next);

    const invalid = firstInvalid(RULES, next);
    if (invalid) {
      document.getElementById(fieldId(PREFIX, invalid))?.focus();
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const channel = CHANNELS.find((item) => item.id === submitter?.getAttribute("value")) ?? CHANNELS[0];
    const href = channel.href(String(data.get("message")).trim());
    if (channel.id === "whatsapp") {
      window.open(href, "_blank", "noopener");
    } else {
      window.location.href = href;
    }
  };

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
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <FormField
                  prefix={PREFIX}
                  name="message"
                  multiline
                  label={closingContent.message.label}
                  icon={closingContent.message.icon}
                  placeholder={closingContent.message.placeholder}
                  error={errors.message}
                />

                {/* Hand-built rather than `ChipButton`, because a submit has
                    to be a `<button>`. The arrow comes from the same component
                    the links use, so the hover cannot diverge. Which one was
                    pressed is the channel. */}
                <div className="flex flex-wrap gap-3">
                  {CHANNELS.map(({ id, label, Icon }) => (
                    <button key={id} type="submit" value={id} className="chip-cta chip-cta-dark">
                      <span className="chip-cta_label">
                        <span className="inline-flex items-center gap-2">
                          <Icon className="size-3.5 shrink-0" />
                          {label}
                        </span>
                      </span>
                      <ChipArrow />
                    </button>
                  ))}
                </div>
              </form>
            </ReadingPanel>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
