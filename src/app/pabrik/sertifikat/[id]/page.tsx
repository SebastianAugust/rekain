import { SertifikatTransaksi } from "@/components/pabrik/sertifikat-transaksi";

export default async function PabrikSertifikatDetailPage(props: PageProps<"/pabrik/sertifikat/[id]">) {
  // Next 16: params is a Promise.
  const { id } = await props.params;
  return <SertifikatTransaksi id={id} />;
}
