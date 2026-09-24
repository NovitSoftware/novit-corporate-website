"use client";

import { ChipArrow } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { FormField, FormStatus } from "../_components/FormField";
import { ReadingPanel } from "@/components/section/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Section } from "@/components/section/Section";
import { SectionLabel } from "@/components/section/SectionLabel";
import { closingContent } from "@/content/home";
import { useUnsentForm } from "../_lib/useUnsentForm";
import type { FieldRules } from "../_lib/form";

const PREFIX = "contact";

/**
 * Declared out here rather than inline: `useUnsentForm` memoizes its handler
 * on this object, so a fresh one every render would rebuild it every render.
 */
const RULES: FieldRules<"name" | "email" | "message"> = {
  name: { min: 2, message: closingContent.errors.name },
  email: { email: true, message: closingContent.errors.email },
  message: { min: 10, message: closingContent.errors.message },
};

/**
 * El cierre, and the form it asks for. It is the last band on the page, so the
 * statement of the ask and the ask itself are one section.
 *
 * The form does not send — see `useUnsentForm` for why, and for the one place
 * to wire it.
 */
export function ContactSection() {
  const { errors, sent, onSubmit } = useUnsentForm(PREFIX, RULES);

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
                  name="name"
                  type="text"
                  autoComplete="name"
                  label={closingContent.fields.name.label}
                  icon={closingContent.fields.name.icon}
                  placeholder={closingContent.fields.name.placeholder}
                  error={errors.name}
                />
                <FormField
                  prefix={PREFIX}
                  name="email"
                  type="email"
                  autoComplete="email"
                  label={closingContent.fields.email.label}
                  icon={closingContent.fields.email.icon}
                  placeholder={closingContent.fields.email.placeholder}
                  error={errors.email}
                />
                <FormField
                  prefix={PREFIX}
                  name="message"
                  multiline
                  label={closingContent.fields.message.label}
                  icon={closingContent.fields.message.icon}
                  placeholder={closingContent.fields.message.placeholder}
                  error={errors.message}
                />

                {/* Hand-built rather than `ChipButton`, because a submit has
                    to be a `<button>`. The arrow comes from the same component
                    the links use, so the hover cannot diverge. */}
                <button type="submit" className="chip-cta chip-cta-dark">
                  <span className="chip-cta_label">
                    <span>{closingContent.submit}</span>
                  </span>
                  <ChipArrow />
                </button>

                <FormStatus>{sent ? closingContent.pending : null}</FormStatus>
              </form>
            </ReadingPanel>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
