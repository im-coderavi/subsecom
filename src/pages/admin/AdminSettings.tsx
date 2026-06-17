import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';
import { imageToDataUrl } from '../../utils/imageToDataUrl';

const SETTING_FIELDS = [
  { key: 'brand_name',     label: 'Brand Name',          placeholder: 'AI Nest',                     icon: 'Type',     group: 'Branding' },
  { key: 'brand_tagline',  label: 'Tagline',             placeholder: 'Premium',                     icon: 'Tag',      group: 'Branding' },
  { key: 'upi_id',         label: 'UPI ID',              placeholder: 'ainest@merchant-upi',         icon: 'QrCode',   group: 'UPI / QR Payment' },
  { key: 'upi_name',       label: 'UPI Display Name',    placeholder: 'AI Nest',                     icon: 'User',     group: 'UPI / QR Payment' },
  { key: 'crypto_address', label: 'Crypto Wallet Address', placeholder: '0x4b78A9C102Ef34…',         icon: 'Bitcoin',  group: 'Crypto Payment' },
  { key: 'crypto_network', label: 'Crypto Network',      placeholder: 'Ethereum (ERC-20)',            icon: 'Network',  group: 'Crypto Payment' },
  { key: 'support_email',    label: 'Support Email',       placeholder: 'support@ainest.com',          icon: 'Mail',          group: 'General' },
  { key: 'site_name',        label: 'Site Name',           placeholder: 'AI Nest',                     icon: 'Globe',         group: 'General' },
  { key: 'whatsapp_number',  label: 'WhatsApp Number',     placeholder: '919876543210 (with country code)', icon: 'MessageCircle', group: 'General' },
];

export function AdminSettings() {
  const token = useAuthStore((s) => s.token);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const dataUrl = await imageToDataUrl(file, 400, 0.9);
      setValues((v) => ({ ...v, brand_logo: dataUrl }));
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setValues(d.settings ?? {}))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', { method: 'PUT', headers, body: JSON.stringify(values) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Group fields
  const groups = Array.from(new Set(SETTING_FIELDS.map((f) => f.group)));

  // Generate QR URL for current UPI value
  const upiId = values['upi_id'] || '';
  const upiName = values['upi_name'] || 'AI Nest';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiString)}`;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-black text-white mb-1">Settings</h1>
      <p className="text-neutral-500 text-sm font-semibold mb-8">Configure payment options and site settings</p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <LucideIcon name="Loader" size={24} className="text-violet-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-800">
                <h2 className="font-extrabold text-white text-sm">{group}</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SETTING_FIELDS.filter((f) => f.group === group).map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-1.5 text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1.5">
                      <LucideIcon name={field.icon} size={10} />
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={values[field.key] || ''}
                      onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>

              {/* Brand logo uploader */}
              {group === 'Branding' && (
                <div className="px-6 pb-6 flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex-shrink-0">
                    {values['brand_logo'] ? (
                      <img src={values['brand_logo']} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-sm italic">
                        {(values['brand_name'] || 'AI Nest').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Logo Image</p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                        {uploadingLogo ? <LucideIcon name="Loader" size={13} className="animate-spin" /> : <LucideIcon name="Upload" size={13} />}
                        {uploadingLogo ? 'Uploading…' : 'Upload Logo'}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
                      </label>
                      {values['brand_logo'] && (
                        <button
                          type="button"
                          onClick={() => setValues((v) => ({ ...v, brand_logo: '' }))}
                          className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl transition-all"
                        >
                          <LucideIcon name="Trash2" size={13} /> Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-600 font-bold">No logo = gradient initials badge. Click Save to apply.</p>
                  </div>
                </div>
              )}

              {/* UPI QR preview */}
              {group === 'UPI / QR Payment' && upiId && (
                <div className="px-6 pb-6 flex items-start gap-5">
                  <div>
                    <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-2">QR Preview</p>
                    <img
                      src={qrUrl}
                      alt="UPI QR"
                      className="w-32 h-32 rounded-xl border border-neutral-700 bg-white p-1"
                    />
                    <p className="text-[10px] text-neutral-600 mt-1.5 font-bold">Updates on save</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">UPI String</p>
                    <code className="text-[10px] text-violet-400 bg-neutral-800 rounded-lg px-2 py-1 break-all">{upiString}</code>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all"
            >
              {saving ? <LucideIcon name="Loader" size={13} className="animate-spin" /> : <LucideIcon name="Save" size={13} />}
              Save Settings
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <LucideIcon name="CheckCircle" size={13} />
                Settings saved!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
