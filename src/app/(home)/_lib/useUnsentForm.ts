"use client";

import { useCallback, useState, type FormEvent } from "react";
import {
  fieldId,
  firstInvalid,
  validateFields,
  type FieldErrors,
  type FieldRules,
} from "./form";

/**
 * ⚠️ TODO(forms): neither form on this site sends.
 *
 * There is no endpoint. A phone number and an inbox are published in the
 * header and the footer (`siteContact`), but an address to write to is not a
 * destination a POST can go to, and a form that silently drops what someone
 * typed is worse than one that says it is not connected. So a valid submit
 * sets `sent`, and the section renders its own not-connected message.
 *
 * Everything around that is real and stays real once it is wired: validation
 * runs on submit, the first invalid field takes focus, errors are announced.
 * Replace the `setSent(true)` below with the request and delete this note —
 * once, for both forms, which is the reason this is a hook and not two copies
 * of the same handler.
 *
 * Validation runs on submit rather than on every keystroke on purpose: a
 * field that turns red while someone is still typing their email address is
 * telling them they are wrong when they are simply not finished.
 */
export function useUnsentForm<Name extends string>(
  prefix: string,
  rules: FieldRules<Name>,
) {
  const [errors, setErrors] = useState<FieldErrors<Name>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const next = validateFields(rules, new FormData(event.currentTarget));
      setErrors(next);

      const invalid = firstInvalid(rules, next);
      if (invalid) {
        // Not `sent`: a failed attempt has to clear a message left over from
        // a previous successful one, or the form reads as having gone through
        // while showing errors.
        setSent(false);
        document.getElementById(fieldId(prefix, invalid))?.focus();
        return;
      }

      setSent(true);
    },
    [prefix, rules],
  );

  return { errors, sent, onSubmit };
}
