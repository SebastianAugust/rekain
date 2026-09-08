"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Minimal accessible form row. The base-nova shadcn registry has no `form`
 * component, so this stands in for it: it owns the generated ids and wires
 * `htmlFor`, `aria-describedby` and `aria-invalid` for the control.
 */
export function Field({
  label,
  error,
  description,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean;
  }) => React.ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-xs font-medium text-tinta-pudar">
        {label}
        {/* The guard thread's second and last job: marking what is required. */}
        {required && (
          <span className="text-benang" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {description && (
        <p id={descriptionId} className="text-xs text-tinta-pudar">
          {description}
        </p>
      )}

      {children({ id, "aria-describedby": describedBy, "aria-invalid": Boolean(error) })}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-benang">
          {error}
        </p>
      )}
    </div>
  );
}
