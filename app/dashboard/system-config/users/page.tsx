import { createClient } from "@/lib/supabase/server";

import { UsersTable } from "@/modules/system-config/users/components/users-table";
import { CreateUserForm } from "@/modules/system-config/users/components/create-user-form";
export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Users Management
        </h1>

        <p className="text-slate-500">
          Manage all users and roles
        </p>
      </div>
      <CreateUserForm />
      <UsersTable users={users || []} />
    </div>
  );
}