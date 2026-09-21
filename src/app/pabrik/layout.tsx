import { AppShell } from "@/components/shell/app-shell";

export default function PabrikLayout({ children }: LayoutProps<"/pabrik">) {
  return <AppShell role="pabrik">{children}</AppShell>;
}
