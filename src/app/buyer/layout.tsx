import { AppShell } from "@/components/shell/app-shell";

export default function BuyerLayout({ children }: LayoutProps<"/buyer">) {
  return <AppShell role="buyer">{children}</AppShell>;
}
