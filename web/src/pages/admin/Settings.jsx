import { useState } from 'react'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/ui/Badge'
import ThemeToggle from '../../components/ui/ThemeToggle'

export default function AdminSettings() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General
    platformName: 'Tanamanku',
    platformDescription: 'Belanja, rawat, dan tumbuhkan kebun perkotaanmu dalam satu aplikasi.',
    
    // Shipping
    defaultShippingCost: 15000,
    expressShippingCost: 35000,
    sameDayShippingCost: 60000,
    
    // Order
    maxCartItems: 50,
    minOrderAmount: 10000,
    
    // Commission
    sellerCommission: 5,
    
    // Midtrans
    midtransSandbox: true,
    midtransClientId: 'SB-Mid-client-XXXXX',
    midtransServerKey: 'SB-Mid-server-XXXXX',
    midtransEnabled: true,
    
    // Notification
    emailNotifications: true,
    orderNotifications: true,
  })

  const set = (key) => (e) => setSettings({ ...settings, [key]: e.target.value })
  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] })

  const save = () => {
    showToast('Pengaturan berhasil disimpan ✨')
  }

  const tabs = [
    { id: 'general', label: '🏪 Umum', icon: '🏪' },
    { id: 'shipping', label: '🚚 Pengiriman', icon: '🚚' },
    { id: 'payment', label: '💳 Pembayaran', icon: '💳' },
    { id: 'notification', label: '🔔 Notifikasi', icon: '🔔' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-leaf-950 dark:text-white">⚙️ Pengaturan Platform</h1>
          <p className="mt-1 text-sm text-leaf-900/50 dark:text-sage-400">Konfigurasi seluruh sistem Tanamanku</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar Tabs */}
        <div className="no-scrollbar flex flex-row gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === t.id
                  ? 'bg-leaf-600 text-white shadow-sm'
                  : 'bg-white text-leaf-900/60 hover:bg-leaf-50 dark:bg-sage-800 dark:text-sage-300 dark:hover:bg-sage-700'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label.replace(/^.\s/, '')}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft dark:border-sage-800 dark:bg-sage-900">
              <h3 className="text-lg font-bold text-leaf-950 dark:text-white">🏪 Pengaturan Umum</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-leaf-900 dark:text-sage-300">Nama Platform</label>
                  <input
                    value={settings.platformName}
                    onChange={set('platformName')}
                    className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100 dark:border-sage-700 dark:bg-sage-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-leaf-900 dark:text-sage-300">Deskripsi</label>
                  <textarea
                    value={settings.platformDescription}
                    onChange={set('platformDescription')}
                    rows={3}
                    className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100 dark:border-sage-700 dark:bg-sage-800 dark:text-white"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-leaf-900 dark:text-sage-300">Min. Order (Rp)</label>
                    <input
                      type="number"
                      value={settings.minOrderAmount}
                      onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                      className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none dark:border-sage-700 dark:bg-sage-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-leaf-900 dark:text-sage-300">Maks. Item Keranjang</label>
                    <input
                      type="number"
                      value={settings.maxCartItems}
                      onChange={(e) => setSettings({ ...settings, maxCartItems: Number(e.target.value) })}
                      className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none dark:border-sage-700 dark:bg-sage-800 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-leaf-900 dark:text-sage-300">Komisi Seller (%)</label>
                  <input
                    type="number"
                    value={settings.sellerCommission}
                    onChange={(e) => setSettings({ ...settings, sellerCommission: Number(e.target.value) })}
                    className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none dark:border-sage-700 dark:bg-sage-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft dark:border-sage-800 dark:bg-sage-900">
              <h3 className="text-lg font-bold text-leaf-950 dark:text-white">🚚 Pengaturan Pengiriman</h3>
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-leaf-50 p-4">
                    <p className="text-sm font-semibold text-leaf-900">🚚 Reguler</p>
                    <p className="text-xs text-leaf-900/50">Estimasi 2-4 hari</p>
                    <input
                      type="number"
                      value={settings.defaultShippingCost}
                      onChange={(e) => setSettings({ ...settings, defaultShippingCost: Number(e.target.value) })}
                      className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm focus:border-leaf-400 focus:outline-none"
                      placeholder="Biaya (Rp)"
                    />
                  </div>
                  <div className="rounded-xl bg-sky-50 p-4">
                    <p className="text-sm font-semibold text-leaf-900">⚡ Express</p>
                    <p className="text-xs text-leaf-900/50">Estimasi 1-2 hari</p>
                    <input
                      type="number"
                      value={settings.expressShippingCost}
                      onChange={(e) => setSettings({ ...settings, expressShippingCost: Number(e.target.value) })}
                      className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm focus:border-leaf-400 focus:outline-none"
                      placeholder="Biaya (Rp)"
                    />
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-leaf-900">🚀 Same Day</p>
                    <p className="text-xs text-leaf-900/50">Jabodetabek hari ini</p>
                    <input
                      type="number"
                      value={settings.sameDayShippingCost}
                      onChange={(e) => setSettings({ ...settings, sameDayShippingCost: Number(e.target.value) })}
                      className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm focus:border-leaf-400 focus:outline-none"
                      placeholder="Biaya (Rp)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings (Midtrans) */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Midtrans Status */}
              <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft dark:border-sage-800 dark:bg-sage-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-leaf-950">💳 Midtrans Payment Gateway</h3>
                    <p className="mt-1 text-sm text-leaf-900/50">Integrasi pembayaran dengan Midtrans</p>
                  </div>
                  <Badge className={settings.midtransEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                    {settings.midtransEnabled ? '✅ Aktif' : '❌ Nonaktif'}
                  </Badge>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Enable/Disable */}
                  <div className="flex items-center justify-between rounded-xl bg-leaf-50 p-4">
                    <div>
                      <p className="font-semibold text-leaf-950">Aktifkan Midtrans</p>
                      <p className="text-xs text-leaf-900/50">Aktifkan/nonaktifkan payment gateway</p>
                    </div>
                    <button
                      onClick={() => toggle('midtransEnabled')}
                      className={`relative h-6 w-11 rounded-full transition ${
                        settings.midtransEnabled ? 'bg-leaf-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        settings.midtransEnabled ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Sandbox Mode */}
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
                    <div>
                      <p className="font-semibold text-leaf-950">🧪 Sandbox Mode</p>
                      <p className="text-xs text-leaf-900/50">Gunakan environment testing Midtrans</p>
                    </div>
                    <button
                      onClick={() => toggle('midtransSandbox')}
                      className={`relative h-6 w-11 rounded-full transition ${
                        settings.midtransSandbox ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        settings.midtransSandbox ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Client Key */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-leaf-900">Client Key</label>
                    <input
                      value={settings.midtransClientId}
                      onChange={set('midtransClientId')}
                      className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 font-mono text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                      placeholder="SB-Mid-client-XXXXX"
                    />
                    <p className="mt-1 text-xs text-leaf-900/40">Dari Merchant Dashboard → Settings → API Keys</p>
                  </div>

                  {/* Server Key */}
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-leaf-900">Server Key</label>
                    <input
                      type="password"
                      value={settings.midtransServerKey}
                      onChange={set('midtransServerKey')}
                      className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 font-mono text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                      placeholder="SB-Mid-server-XXXXX"
                    />
                    <p className="mt-1 text-xs text-leaf-900/40">⚠️ Jangan bagikan server key ke siapapun</p>
                  </div>

                  {/* Supported Payment Methods */}
                  <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                    <p className="text-sm font-bold text-blue-800">💳 Metode Pembayaran yang Didukung:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['🏦 Transfer Bank', '🏧 Virtual Account', '💚 GoPay', '🛒 ShopeePay', '📱 QRIS', '🏪 Indomaret', '🏬 Alfamart', '💳 Kartu Kredit'].map((m) => (
                        <span key={m} className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Midtrans Info */}
              <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
                <h3 className="font-bold text-leaf-950">📋 Cara Mendapatkan API Key</h3>
                <ol className="mt-3 space-y-2 text-sm text-leaf-900/70">
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">1</span>
                    <span>Daftar akun di <a href="https://dashboard.midtrans.com" target="_blank" rel="noopener" className="font-semibold text-leaf-700 hover:underline">dashboard.midtrans.com</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">2</span>
                    <span>Masuk ke Settings → API Keys</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">3</span>
                    <span>Copy <strong>Client Key</strong> dan <strong>Server Key</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">4</span>
                    <span>Gunakan <strong>Sandbox Key</strong> untuk testing, <strong>Production Key</strong> untuk live</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notification' && (
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft dark:border-sage-800 dark:bg-sage-900">
              <h3 className="text-lg font-bold text-leaf-950 dark:text-white">🔔 Pengaturan Notifikasi</h3>
              <div className="mt-4 space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Email Notifikasi', desc: 'Kirim notifikasi via email' },
                  { key: 'orderNotifications', label: 'Notifikasi Pesanan', desc: 'Notifikasi saat ada pesanan baru' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-xl bg-leaf-50 p-4">
                    <div>
                      <p className="font-semibold text-leaf-950">{item.label}</p>
                      <p className="text-xs text-leaf-900/50">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggle(item.key)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        settings[item.key] ? 'bg-leaf-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        settings[item.key] ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button onClick={save} size="lg">
            💾 Simpan Pengaturan
          </Button>
        </div>
      </div>
    </div>
  )
}
