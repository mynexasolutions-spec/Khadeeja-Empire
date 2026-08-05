import { safeAdminRedirectPath } from "@/lib/auth/redirect";
import { AdminLoginForm } from "./AdminLoginForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return <AdminLoginForm next={safeAdminRedirectPath(next)} />;
}
