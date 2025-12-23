import { Suspense } from "react";
import { Loader } from "@/components/loader";
import RoleBasedDashboard from "@/components/role-based-dashboaed";

export default function ProtectedPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RoleBasedDashboard />
    </Suspense>
  );
}