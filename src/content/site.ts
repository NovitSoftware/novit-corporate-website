/* ==========================================================================
   Novit — the content layer, as a manifest

   One file per route, named after it, plus `shared.ts` for the values a
   second route reads. Everything is re-exported from here so `@/content/site`
   stays the one import path every component uses.

   Nothing but re-exports belongs in this file. A partial may be edited
   freely; adding a route means adding a line here.
   ========================================================================== */

export * from "./shared";
export * from "./home";
export * from "./inteligencia-artificial";
export * from "./academianovit";
