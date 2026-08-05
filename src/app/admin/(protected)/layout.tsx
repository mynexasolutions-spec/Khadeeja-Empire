import { redirect } from "next/navigation";
import { AdminShell } from "../../../components/admin/AdminShell";
import { UnauthorizedError } from "../../../lib/auth/errors";
import { requireAdmin } from "../../../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/admin/login");
    throw error;
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
