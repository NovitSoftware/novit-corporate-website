/**
 * Validation for the site's two forms — the contact enquiry and the Academia
 * registration.
 *
 * Both were going to need the same three checks, the same "first invalid field
 * takes focus" behaviour and the same not-connected-yet message, so the rules
 * are declared as data here and the behaviour lives in `useUnsentForm`. The
 * alternative was a second copy of `ContactSection`'s submit handler, which is
 * how the two forms would have drifted: a stricter email pattern on one, a
 * different minimum on the other, and no way to tell which was intended.
 */

/**
 * Deliberately loose: something, an @, something, a dot, something.
 *
 * A stricter pattern rejects real addresses — the grammar in RFC 5322 admits
 * quoted local parts and address literals that no regex here should be
 * ruling on — and the only authority on whether an address works is trying to
 * deliver to it.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * One rule per field, and one message with it.
 *
 * One message rather than one per failure mode, because that is what the
 * content files hold: a field either passes or it says the single thing worth
 * saying about it. `min` is the trimmed length a value has to reach; `email`
 * runs the pattern above instead.
 */
export type FieldRule = {
  message: string;
  min?: number;
  email?: boolean;
};

export type FieldRules<Name extends string> = Readonly<
  Record<Name, FieldRule>
>;

export type FieldErrors<Name extends string> = Partial<Record<Name, string>>;

/**
 * Checks `data` against `rules` and returns a message per failing field.
 *
 * Order is the order of `rules`, which is the order the fields are declared in
 * the content file and therefore the order they appear on screen — that is
 * what makes "focus the first invalid one" mean the topmost one.
 */
export function validateFields<Name extends string>(
  rules: FieldRules<Name>,
  data: FormData,
): FieldErrors<Name> {
  const errors: FieldErrors<Name> = {};

  for (const [name, rule] of Object.entries(rules) as Array<
    [Name, FieldRule]
  >) {
    const value = String(data.get(name) ?? "").trim();

    if (rule.email ? !EMAIL.test(value) : value.length < (rule.min ?? 1)) {
      errors[name] = rule.message;
    }
  }

  return errors;
}

/** The first field in `rules` order that failed, or undefined if none did. */
export function firstInvalid<Name extends string>(
  rules: FieldRules<Name>,
  errors: FieldErrors<Name>,
): Name | undefined {
  return (Object.keys(rules) as Name[]).find((name) => errors[name]);
}

/**
 * The id a field and its error node share.
 *
 * Prefixed per form, so mounting both on one page cannot produce two elements
 * answering to `#email` — which would make the label point at whichever came
 * first and silently break the other form's focus and announcement.
 */
export function fieldId(prefix: string, name: string): string {
  return `${prefix}-${name}`;
}
