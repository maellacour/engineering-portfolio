// Kill switch for the contact + capture forms. Set NEXT_PUBLIC_CONTACT_ENABLED
// to "false" (or "0") to turn them off: the server stops sending, and the forms
// are hidden in favour of the direct email / LinkedIn links. Any other value,
// including unset, keeps them on. Changing it takes effect on the next deploy.
const flag = process.env.NEXT_PUBLIC_CONTACT_ENABLED?.toLowerCase();

export const contactEnabled = flag !== "false" && flag !== "0";
