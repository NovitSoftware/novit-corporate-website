/* The contact section. The form does not send — see below. */

/**
 * The contact section.
 *
 * The form does not send. A phone number and an inbox address are now
 * published in the header and footer (see `siteContact`), but neither is a
 * form endpoint — wiring the submit means a real destination for what people
 * type, and a form that silently drops it is worse than one that says it
 * isn't connected yet. `ContactSection.tsx` carries the TODO and the field
 * validation is real, so connecting it is one function.
 */
export const contactContent = {
  index: "07",
  eyebrow: "Contacto",
  title: "Contanos qué proceso querés resolver",
  description:
    "Entramos por un discovery o una prueba acotada: una conversación corta para entender cómo trabajás hoy, y una propuesta con alcance, plazo y dueño.",
  fields: {
    name: { label: "Nombre", placeholder: "Cómo te llamás" },
    email: { label: "Email", placeholder: "nombre@empresa.com" },
    message: {
      label: "Mensaje",
      placeholder: "Qué proceso querés resolver, y con qué se sostiene hoy.",
    },
  },
  submit: "Enviar mensaje",
  /** Shown after a valid submit, since nothing is actually delivered. */
  pending:
    "Este formulario todavía no está conectado, así que el mensaje no se envió. Estamos terminando de configurar la dirección de contacto.",
  errors: {
    name: "Escribí tu nombre.",
    email: "Escribí un email válido.",
    message: "Contanos brevemente qué necesitás.",
  },
} as const;
