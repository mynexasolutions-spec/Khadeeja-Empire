import { getAdminAuthConfig } from "@/lib/auth/config";
import { getDataProvider } from "@/lib/data";
import { saveProfileAction } from "@/actions/admin/settings";
import { AdminCard, PageHeading } from "../../_components/AdminPage";
import { MediaUpload } from "@/components/admin/MediaUpload";

export const dynamic = "force-dynamic";

const input =
  "mt-1 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#9c5247] focus:ring-2 focus:ring-[#9c5247]/20";

export default async function ProfilePage() {
  const profiles = await getDataProvider().listProfiles();
  const profile = profiles[0];
  const auth = getAdminAuthConfig();

  return (
    <div>
      <PageHeading title="Admin profile" description="Update the administrator contact details displayed in the dashboard." />
      <AdminCard className="max-w-3xl p-5 sm:p-6">
        <form action={saveProfileAction} className="space-y-5">
          <input type="hidden" name="id" value={profile?.id || "admin-profile"} />
          <input type="hidden" name="role" value="admin" />
          <label className="block text-sm font-medium text-stone-700">
            Full name
            <input className={input} name="fullName" defaultValue={profile?.fullName || "Administrator"} />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Email
            <input className={input} name="email" type="email" defaultValue={profile?.email || auth.email} />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Phone
            <input className={input} name="phone" defaultValue={profile?.phone || ""} />
          </label>
          <div className="text-sm font-medium text-stone-700">
            <MediaUpload name="avatarUrl" label="Avatar" defaultValue={profile?.avatarUrl || ""} folder="khadeeja/content" aspectClassName="aspect-square max-w-56" />
          </div>
          <div className="flex justify-end border-t border-stone-100 pt-5">
            <button className="min-h-11 rounded-lg bg-[#9c5247] px-5 text-sm font-semibold text-white">Save profile</button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
