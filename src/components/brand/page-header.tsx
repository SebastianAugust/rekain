import { Eyebrow } from "@/components/brand/eyebrow";
import { cn } from "@/lib/utils";

/** The page frame every dashboard route sits in — one gutter, one measure. */
export function Halaman({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-[1190px] px-w4 py-w5 sm:px-w5 sm:py-w6", className)}>{children}</div>;
}

/**
 * Kicker, title, optional lede and action. Nine routes had hand-assembled this
 * with slightly different gaps; the title also steps up at `sm` now, so the page
 * heading clearly outranks the card titles beneath it on a wide screen.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-w6 flex flex-wrap items-end justify-between gap-x-w4 gap-y-w3",
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        <Eyebrow className="mb-w2">{eyebrow}</Eyebrow>
        <h1 className="judul text-3xl text-tinta sm:text-[2.5rem] sm:leading-[1.1]">{title}</h1>
        {description && <p className="mt-w3 text-base text-tinta-pudar">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
