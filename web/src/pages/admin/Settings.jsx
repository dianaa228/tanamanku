import { useState } from 'react'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

export default function AdminSettings() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    platformName: 'Tanamanku',
    defaultShippingCost: 15000,
    expressShippingCost: 35000,
    maxCartItems: 50,
    minOrderAmount: 10000,
    sellerCommission: 5,
  })

  const set = (key) => (e) => setSettings({ ...settings, [key]: e.target.value })

  const save = () => {
    showToast('Pengaturan berhasil disimpan ✨')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-extrabold text-leaf-950">⚙️ Pengaturan Platform</h2>

      <div className="space-y-4 rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h3 className="font-bold text-leaf-950">🏪 Umum</h3>

        <div>
          <label className="mb-1 block text-sm font-semibold text-leaf-900">Nama Platform</label>
          <input
            value={settings.platformName}
            onChange={set('platformName')}
            className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Ongkir Default (Rp)</label>
            <input
              type="number"
              value={settings.defaultShippingCost}
              onChange={(e) => setSettings({ ...settings, defaultShippingCost: Number(e.target.value) })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Ongkir Express (Rp)</label>
            <input
              type="number"
              value={settings.expressShippingCost}
              onChange={(e) => setSettings({ ...settings, expressShippingCost: Number(e.target.value) })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Min. Order (Rp)</label>
            <input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Maks. Item Keranjang</label>
            <input
              type="number"
              value={settings.maxCartItems}
              onChange={(e) => setSettings({ ...settings, maxCartItems: Number(e.target.value) })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-leaf-900">Komisi Seller (%)</label>
          <input
            type="number"
            value={settings.sellerCommission}
            onChange={(e) => setSettings({ ...settings, sellerCommission: Number(e.target.value) })}
            className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
          />
        </div>
      </div>

      <Button onClick={save}>💾 Simpan Pengaturan</Button>
    </div>
  )
}
