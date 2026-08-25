import * as runtime from "react/jsx-runtime";

// Velite's s.mdx() compiles MDX to a function-body string. This turns that
// string into a renderable component (the documented Velite pattern).
export function MDXContent({ code }: { code: string }) {
  const fn = new Function(code);
  const Component = fn({ ...runtime }).default;
  return <Component />;
}
