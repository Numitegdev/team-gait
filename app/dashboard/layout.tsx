import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <DashboardLayout
      role={profile?.role}
      fullName={profile?.full_name}
    >
      {children}
    </DashboardLayout>
  );
}