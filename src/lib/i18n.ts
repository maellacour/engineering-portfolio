// Single-locale for now. Kept in one place so adding FR later (e.g. via
// next-intl or locale-prefixed content) is a localised change, not a rewrite.
export const defaultLocale = "en" as const;
export type Locale = typeof defaultLocale;
