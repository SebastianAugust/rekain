"use client";

import { notFound } from "next/navigation";

import { MaterialDetail, MaterialDetailSkeleton } from "@/components/buyer/material-detail";
import { useListing } from "@/lib/data/hooks";

export function MaterialDetailClient({ id }: { id: string }) {
  const { data, isPending } = useListing(id);

  if (isPending) return <MaterialDetailSkeleton />;
  if (!data) notFound();

  return <MaterialDetail listing={data} />;
}
