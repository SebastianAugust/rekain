"use client";

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
    />
  );
}
