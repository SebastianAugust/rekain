"use client";

import { AksiPabrik } from "@/components/shared/aksi-transaksi";
import { TransactionList } from "@/components/shared/transaction-list";
import { useTransaksiPabrik } from "@/lib/data/hooks";

export default function PabrikTransaksiPage() {
  const { data, isPending, isError, refetch } = useTransaksiPabrik();
  return (
    <TransactionList
      items={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      role="pabrik"
      aksi={(t) => <AksiPabrik t={t} />}
    />
  );
}
