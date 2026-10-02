import { fetchAllSettings } from '@/app/actions/settings';
import { SETTING_GROUPS } from '@/lib/public-settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Pengaturan · Panel Admin Averi Digital' };

export default async function Page() {
  const rows = await fetchAllSettings();
  const initial: Record<string, string> = {};
  for (const row of rows) initial[row.key] = row.value;

  return (
    <div>
      <header className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
          Pengaturan
        </span>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-ink">
          Identitas &amp; Pembayaran
        </h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted leading-relaxed">
          Semua perubahan di sini langsung dipakai situs tanpa deploy ulang. Gambar diunggah ke
          Cloudinary, jadi file tidak membebani server.
        </p>
      </header>

      <SettingsForm groups={SETTING_GROUPS} initial={initial} />
    </div>
  );
}
