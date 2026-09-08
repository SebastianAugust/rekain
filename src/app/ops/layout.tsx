import { AppShell } from "@/components/shell/app-shell";

export default function OpsLayout({ children }: LayoutProps<"/ops">) {
  return <AppShell role="ops">{children}</AppShell>;
}
