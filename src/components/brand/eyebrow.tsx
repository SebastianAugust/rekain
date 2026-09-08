import { cn } from "@/lib/utils";

/**
 * Small mono kicker above a heading.
 *
 * `nila-3` is the natural choice here and it is wrong: at 4.18:1 on white it
 * fails AA for text this size. One rung deeper on the dip ladder clears it.
 */
export function Eyebrow({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-mono text-xs tracking-widest uppercase text-nila-tinta", className)}
      {...props}
    >
      {children}
    </div>
  );
}
