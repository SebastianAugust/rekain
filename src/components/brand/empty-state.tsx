import type { LucideIcon } from "lucide-react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { tombol } from "@/components/brand/tombol";
import { cn } from "@/lib/utils";

/**
 * A patch: a small square of lighter cloth tacked on slightly crooked, carrying
 * the state's icon. It is the one hand-placed object in an otherwise gridded
 * product, which is exactly why empty and error states get it.
 */
function Tambalan({ icon: Icon, putus }: { icon: LucideIcon; putus?: boolean }) {
  return (
    <span
      className={cn(
        "relative flex size-14 items-center justify-center rounded-full shadow-panel",
        putus ? "bg-benang/10" : "bg-nila-1/40",
      )}
      aria-hidden="true"
    >
      <Icon size={22} className={putus ? "text-benang" : "text-nila-6"} />
    </span>
  );
}

/**
 * An empty list still has to explain itself and offer the next move. The frame
 * is a sewn seam rather than `border-dashed` — same signal, made by a person.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  judul: Judul = "h2",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  /** `h1` when the state *is* the page (a 404); `h2` under an existing page title. */
  judul?: "h1" | "h2";
}) {
  return (
    <div className="relative rounded-kartu border border-garis permukaan px-w4 py-w7 text-center shadow-panel">
      <div className="relative flex flex-col items-center">
        <Tambalan icon={icon} />
        <Judul className="judul-kecil mt-w4 text-base text-tinta">{title}</Judul>
        <p className="mt-w1 max-w-sm text-sm text-pretty text-tinta-pudar">{description}</p>
        {action && <div className="mt-w4">{action}</div>}
      </div>
    </div>
  );
}

/**
 * The failure sibling of EmptyState. Before this existed, a failed query fell
 * through to the empty branch and told the user "nothing here yet" — a lie that
 * sends people to upload stock that is already listed. The seam is unpicked and
 * the thread is red: this came apart, it is not simply empty.
 */
export function ErrorState({
  title = "Data gagal dimuat",
  description = "Koneksi ke server terputus sebentar. Data Anda aman — coba muat ulang.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="relative rounded-kartu border border-garis permukaan px-w4 py-w7 text-center shadow-panel"
    >
      <div className="relative flex flex-col items-center">
        <Tambalan icon={TriangleAlert} putus />
        <h2 className="judul-kecil mt-w4 text-base text-tinta">{title}</h2>
        <p className="mt-w1 max-w-sm text-sm text-pretty text-tinta-pudar">{description}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className={cn(tombol({ nada: "garis" }), "mt-w4")}>
            <RotateCcw size={14} aria-hidden="true" /> Coba lagi
          </button>
        )}
      </div>
    </div>
  );
}
