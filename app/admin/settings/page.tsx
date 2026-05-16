import { db } from "@/lib/db";
import AdminSettingsClient from "@/components/admin/settings/settings-client";

async function getSettings() {
  const settings = await db.siteSettings.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  return map;
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Settings</h1>
        <p className="text-xs text-brand-400 tracking-wide mt-1">
          Control everything on your store from here
        </p>
      </div>
      <AdminSettingsClient settings={settings} />
    </div>
  );
}
