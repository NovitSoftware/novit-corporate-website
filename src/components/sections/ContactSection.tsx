"use client";

import { ChipArrow } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { FormField, FormStatus } from "@/components/forms/FormField";
import { ReadingPanel } from "@/components/ui/ReadingPanel";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { contactContent } from "@/content/site";
import { useUnsentForm } from "@/hooks/useUnsentForm";
import type { FieldRules } from "@/lib/form";

const PREFIX = "contact";

/**
 * Declared out here rather than inline: `useUnsentForm` memoizes its handler
 * on this object, so a fresh one every render would rebuild it every render.
 */
const RULES: FieldRules<"name" | "email" | "message"> = {
  name: { min: 2, message: contactContent.errors.name },
  email: { email: true, message: contactContent.errors.email },
  message: { min: 10, message: contactContent.errors.message },
};

/**
 * The contact form. It does not send — see `useUnsentForm` for why, and for
 * the one place to wire it.
 */
export function ContactSection() {
  const { errors, sent, onSubmit } = useUnsentForm(PREFIX, RULES);

  return (
    <Section id="contacto">
      <Scene>
        <Container>
          {/* The ask beside the form, not above it.

              The statement used to run the full width with the form under its
              right half, which left the whole lower left of the band empty —
              744×510px, the largest dead area on the page. Putting the opener
              *in* the left column balances ~450px of copy against a ~600px
              form, and pinning that column means what is left travels with the
              fields it explains until the band ends.

              `items-start` is load-bearing: a stretched grid item fills its row
              and has no slack to stick within. This is the same shape as
              `SafetySection`, which is the one band that never had this hole. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+4rem)]">
              <SectionIntro
                index={contactContent.index}
                eyebrow={contactContent.eyebrow}
                title={contactContent.title}
                layout="stacked"
              >
                <p
                  data-anim="rise"
                  className="max-w-[42ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
                >
                  {contactContent.description}
                </p>
              </SectionIntro>
            </div>

            <ReadingPanel as="div">
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <FormField
                  prefix={PREFIX}
                  name="name"
                  type="text"
                  autoComplete="name"
                  label={contactContent.fields.name.label}
                  placeholder={contactContent.fields.name.placeholder}
                  error={errors.name}
                />
                <FormField
                  prefix={PREFIX}
                  name="email"
                  type="email"
                  autoComplete="email"
                  label={contactContent.fields.email.label}
                  placeholder={contactContent.fields.email.placeholder}
                  error={errors.email}
                />
                <FormField
                  prefix={PREFIX}
                  name="message"
                  multiline
                  label={contactContent.fields.message.label}
                  placeholder={contactContent.fields.message.placeholder}
                  error={errors.message}
                />

                {/* Hand-built rather than `ChipButton`, because a submit has
                    to be a `<button>`. The arrow comes from the same component
                    the links use, so the hover cannot diverge. */}
                <button type="submit" className="chip-cta chip-cta-dark">
                  <span className="chip-cta_label">
                    <span>{contactContent.submit}</span>
                  </span>
                  <ChipArrow />
                </button>

                <FormStatus>{sent ? contactContent.pending : null}</FormStatus>
              </form>
            </ReadingPanel>
          </div>
        </Container>
      </Scene>
    </Section>
  );
}
