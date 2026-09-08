import { MaterialDetailClient } from "@/app/buyer/material/[id]/material-detail-client";

export default async function BuyerMaterialPage(props: PageProps<"/buyer/material/[id]">) {
  // Next 16: params is a Promise — synchronous access has been removed.
  const { id } = await props.params;
  return <MaterialDetailClient id={id} />;
}
