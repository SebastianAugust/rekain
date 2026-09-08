"use client";

import { TransactionList } from "@/components/shared/transaction-list";
import { useTransaksiPabrik } from "@/lib/data/hooks";

export default function PabrikTransaksiPage() {
  const { data, isPending } = useTransaksiPabrik();
  return <TransactionList items={data} isPending={isPending} role="pabrik" />;
}
