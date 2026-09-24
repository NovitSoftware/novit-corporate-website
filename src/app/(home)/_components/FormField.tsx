import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fieldId } from "../_lib/form";

type FormFieldProps = {
  /** Namespaces the id, so two forms can share a page. See `lib/form.ts`. */
  prefix: string;
  name: string;
  label: string;
  /** The field's mark, in front of its label: who, where to answer, what. */
  icon: IconName;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  autoComplete?: string;
};

/**
 * Label, control and error in one block, for both forms on the site.
 *
 * This was `ContactSection`'s own `Field`. The Academia's registration form
 * needs the same three parts wired the same way, and the wiring is the part
 * worth not writing twice: the error owns a permanent node so appearing does
 * not reflow the fields below it, and `aria-describedby` points at it
 * unconditionally — an id that resolves to empty text is read as nothing,
 * whereas an id that appears and disappears is not always picked up.
 *
 * Styling is `.field` / `.field-label` in globals.css, built for the one
 * ground these sit on: the glass reading panel.
 */
export function FormField({
  prefix,
  name,
  label,
  icon,
  placeholder,
  error,
  multiline = false,
  rows = 5,
  type = "text",
  autoComplete,
}: FormFieldProps) {
  const id = fieldId(prefix, name);
  const shared = {
    id,
    name,
    placeholder,
    autoComplete,
    className: "field",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": `${id}-error`,
  } as const;

  return (
    <div className="field-row">
      <label className="field-label" htmlFor={id}>
        <Icon name={icon} size="micro" className="field-label_icon" />
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} />
      )}
      <p
        id={`${id}-error`}
        className="card-ink-voice mt-2 min-h-[1.25rem] text-[0.8125rem] font-bold"
      >
        {error ?? ""}
      </p>
    </div>
  );
}

/**
 * What the form says after a valid submit.
 *
 * Polite, not assertive: this is the outcome of an action the visitor just
 * took, so it does not need to interrupt what they are reading. The node is
 * permanent and starts empty — an `aria-live` region has to be in the
 * document before the text arrives for the text to be announced.
 */
export function FormStatus({ children }: { children?: ReactNode }) {
  return (
    <p
      aria-live="polite"
      className="card-ink-body text-[0.875rem] leading-relaxed"
    >
      {children}
    </p>
  );
}
