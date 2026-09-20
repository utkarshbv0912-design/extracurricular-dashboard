import type { ComponentProps } from "react";

/**
 * Container: page width + horizontal padding in one place. Every page's
 * content sits in a Container so gutters and max width never drift between
 * routes.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={"mx-auto w-full max-w-5xl px-4 sm:px-6 " + (className ?? "")}
      {...props}
    />
  );
}
