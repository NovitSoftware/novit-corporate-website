import { Icon, type IconName } from "@/components/ui/Icon";

type FormFieldProps = {
  /** Namespaces the id, so another field on the page cannot take it. */
  prefix: string;
  name: string;
  label: string;
  /** The field's mark, in front of its label. */
  icon: IconName;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

/**
 * A label and the box it names: the contact message.
 *
 * Controlled, because what is typed is what the send links carry — see
 * `ContactSection`. There is no error state: nothing typed here is ever
 * refused, since the message is sent, and can still be edited, from WhatsApp
 * or the mail client.
 *
 * Styling is `.field` / `.field-label` in forms.css, built for the one ground
 * it sits on: the glass reading panel.
 */
export function FormField({
  prefix,
  name,
  label,
  icon,
  placeholder,
  value,
  onChange,
  rows = 5,
}: FormFieldProps) {
  const id = `${prefix}-${name}`;

  return (
    <div className="field-row">
      <label className="field-label" htmlFor={id}>
        <Icon name={icon} size="micro" className="field-label_icon" />
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      />
    </div>
  );
}
