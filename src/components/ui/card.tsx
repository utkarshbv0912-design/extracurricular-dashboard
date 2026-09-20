import type { ComponentProps } from "react";

/**
 * Card: the standard content surface. Use `CardHeader` for a title block and
 * `CardBody` for content so spacing stays consistent everywhere.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={
        "rounded-lg border border-line bg-surface shadow-sm " +
        (className ?? "")
      }
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={
        "flex flex-col gap-1 border-b border-line p-5 " + (className ?? "")
      }
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={"p-5 " + (className ?? "")} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={
        "text-base font-semibold tracking-tight text-foreground " +
        (className ?? "")
      }
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={"text-sm text-body " + (className ?? "")} {...props} />
  );
}
