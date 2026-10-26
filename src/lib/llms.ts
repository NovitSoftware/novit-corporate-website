import { academyContact, academyPageContent, academyProgram } from "@/content/academianovit";
import { casesContent } from "@/content/cases";
import { casesPageContent } from "@/content/casos-de-exito";
import { developmentPageContent } from "@/content/desarrollo-y-consultoria";
import { heroContent, services, teamContent } from "@/content/home";
import { servicesPageContent } from "@/content/inteligencia-artificial";
import { site, siteContact, siteFounders, siteMarkets } from "@/content/site";

/**
 * `/llms.txt` and `/llms-full.txt`: the site as plain Markdown, for language
 * models and the agents that read it (the llms.txt proposal, llmstxt.org).
 *
 * Written from the same content the pages render, so it can never say
 * something the site does not, and stripped of the `**` highlight marks.
 * The facts open both files as sentences that stand on their own — what a
 * model quotes is a sentence it can lift out of context and still be right.
 */

const plain = (text: string) => text.replaceAll("**", "");
const url = (path: string) => `${site.url}${path === "/" ? "/" : `${path}/`}`;

const PAGES = [
  { path: "/", title: "Inicio", about: "Qué hacemos, el equipo y cómo contactarnos." },
  {
    path: "/inteligencia-artificial",
    title: servicesPageContent.title,
    about: servicesPageContent.meta.description,
  },
  {
    path: "/desarrollo-y-consultoria",
    title: "Desarrollo y Consultoría IT",
    about: developmentPageContent.meta.description,
  },
  { path: "/casos-de-exito", title: "Casos de éxito", about: casesPageContent.meta.description },
  { path: "/academianovit", title: academyPageContent.title, about: academyPageContent.meta.description },
] as const;

/** The official data, one quotable sentence each. */
function facts() {
  const founders = siteFounders.map((f) => `${f.name} (${f.role})`).join(" y ");
  return [
    `${site.name} es una empresa argentina de desarrollo de software y transformación con inteligencia artificial, fundada en ${site.foundingYear}.`,
    `${site.name} tiene clientes activos en ${siteMarkets.length} países: ${siteMarkets.join(", ")}.`,
    `${site.name} fue fundada por ${founders}.`,
    `${site.name} es parte de la Anthropic Partner Network y su equipo se capacita con los cursos oficiales de Anthropic.`,
    `${site.name} desarrolla agentes de IA integrados a los procesos de cada empresa, software a medida, consultoría IT (CTO as a Service), staff augmentation y ciberseguridad.`,
    `La Academia Novit es una formación gratuita, 100% online y con aval de UTN-FRBA sobre desarrollo de agentes de IA y software agéntico.`,
  ];
}

export function llmsIndex() {
  return [
    `# ${site.name}`,
    "",
    `> ${plain(heroContent.statement)}`,
    "",
    ...facts().map((fact) => `- ${fact}`),
    "",
    "## Páginas",
    "",
    ...PAGES.map((page) => `- [${page.title}](${url(page.path)}): ${page.about}`),
    "",
    "## Contacto",
    "",
    `- WhatsApp: ${siteContact.phone.label} (${siteContact.phone.href})`,
    `- Email: ${siteContact.email.label}`,
    `- Academia: ${academyContact.email.label}`,
    ...siteContact.social.map((network) => `- ${network.label}: ${network.href}`),
    "",
    "## Opcional",
    "",
    `- [Todo el contenido del sitio en un solo archivo](${site.url}/llms-full.txt)`,
    "",
  ].join("\n");
}

export function llmsFull() {
  const lines: string[] = [
    `# ${site.name} — ${heroContent.title}`,
    "",
    `> ${plain(heroContent.statement)}`,
    "",
    `Sitio: ${site.url}`,
    "",
    "## Datos clave",
    "",
    ...facts().map((fact) => `- ${fact}`),
    "",
    "## Qué hacemos",
    "",
  ];

  for (const service of services) {
    lines.push(`### ${service.label}`, "", plain(service.title), "");
    if ("description" in service) lines.push(plain(service.description), "");
    if ("points" in service) lines.push(...service.points.map((p) => `- ${plain(p)}`), "");
    if ("layers" in service) {
      lines.push(`${service.layers.top}, sobre: ${service.layers.base.map((b) => b.label).join(", ")}.`, "");
    }
  }

  lines.push("## Equipo", "", teamContent.title + ".", "", plain(teamContent.lead), "");

  const ia = servicesPageContent;
  lines.push(`## ${ia.title}`, "", `Página: ${url("/inteligencia-artificial")}`, "", ia.lead, "");
  lines.push(`### ${ia.partner.title}`, "", ia.partner.lead, "", ia.partner.network.text, "");
  lines.push(...ia.partner.items.map((item) => `- **${item.label} — ${item.title}:** ${plain(item.description)}`), "");
  lines.push(`### ${ia.architecture.title}`, "", ia.architecture.lead, "");
  lines.push(...ia.architecture.shared.map((s) => `- **${s.title}:** ${s.detail}`), "");
  lines.push(`### ${ia.evolution.title}`, "", ia.evolution.lead, "");
  lines.push(...ia.evolution.steps.map((s, i) => `${i + 1}. **${s.title}:** ${plain(s.description)}`), "");

  const dev = developmentPageContent;
  lines.push("## Desarrollo y Consultoría IT", "", `Página: ${url("/desarrollo-y-consultoria")}`, "", dev.meta.description, "");
  lines.push(`### ${dev.build.title}`, "", plain(dev.build.lead), "");
  lines.push(...dev.build.stages.map((s) => `- **${s.title}:** ${plain(s.description)}`), "");
  lines.push(`${dev.build.deliverablesLabel}: ${dev.build.deliverables.join(", ")}.`, "");
  lines.push(`### ${dev.consulting.title}`, "", dev.consulting.lead, "");
  lines.push(`${dev.consulting.helpLabel}:`, ...dev.consulting.help.map((h) => `- ${plain(h)}`), "");
  lines.push(...dev.consulting.steps.map((s, i) => `${i + 1}. **${s.title}:** ${plain(s.description)}`), "");

  lines.push("## Casos de éxito", "", `Página: ${url("/casos-de-exito")}`, "", casesPageContent.lead, "");
  for (const study of casesContent.cases) {
    lines.push(`- **${study.title} (${study.logo.name}):** ${plain(study.description)} Resultado: ${study.result}.`);
  }
  lines.push("");
  for (const group of casesPageContent.work.groups) {
    lines.push(`### ${group.title}`, "");
    for (const item of group.items) {
      lines.push(`- ${item.logo.name} (${item.country}): ${plain(item.description)}`);
    }
    lines.push("");
  }
  const worked = new Set(
    casesPageContent.work.groups.flatMap((group) => group.items.flatMap((item) => item.country.split(" y "))),
  );
  lines.push(`Países donde hicimos proyectos: ${[...worked].join(", ")}.`, "");

  lines.push(`## ${academyPageContent.title}`, "", `Página: ${url("/academianovit")}`, "", academyPageContent.lead, "");
  lines.push(...academyProgram.format.facts.map((f) => `- ${f.label}: ${f.value}`), "");
  lines.push(...academyProgram.format.modules.map((m) => `- **${m.title}:** ${m.detail}`), "");
  lines.push(`Consultas: ${academyContact.email.label}`, "");

  lines.push(
    "## Contacto",
    "",
    `- WhatsApp: ${siteContact.phone.label} (${siteContact.phone.href})`,
    `- Email: ${siteContact.email.label}`,
    ...siteContact.social.map((network) => `- ${network.label}: ${network.href}`),
    "",
  );

  return lines.join("\n");
}
