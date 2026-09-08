import type { LucideIcon } from "lucide-react";

/**
 * An empty list still has to explain itself and offer the next move. The border
 * is a sewn seam rather than `border-dashed` — same signal, made by a person.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-garis permukaan px-w4 py-w6 text-center">
      <div className="flex flex-col items-center">
        <Icon size={22} className="text-nila-3" aria-hidden="true" />
        <p className="judul-kecil mt-w3 text-base text-tinta">{title}</p>
        <p className="mt-w1 max-w-sm text-sm text-tinta-pudar">{description}</p>
        {action && <div className="mt-w4">{action}</div>}
      </div>
    </div>
  );
}
