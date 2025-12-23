import { headers } from "next/headers";
import AdminLanding from "@/components/admin/landing";
import CMSLanding from "@/components/csm/landing";

export default async function RoleBasedDashboard() {
  const headersList = await headers();
  const role = headersList.get("x-user-role");

  return role === "admin"
    ? <AdminLanding />
    : <CMSLanding />;
}
