"use client";

import { AksiBuyer } from "@/components/shared/aksi-transaksi";
import { TransactionList } from "@/components/shared/transaction-list";
import { useTransaksiBuyer } from "@/lib/data/hooks";

export default function BuyerTransaksiPage() {
  const { data, isPending, isError, refetch } = useTransaksiBuyer();
  return (
    <TransactionList
      items={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      role="buyer"
      aksi={(t) => <AksiBuyer t={t} />}
    />
  );
}
