import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import { userApi } from '../../services/api/user'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'
import { formatDate } from '../../utils/format'

const EMPTY_FORM = {
  label: '',
  recipient: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  street: '',
  postal_code: '',
  is_default: false,
}

export default function Alamat() {
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', address }
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const load = () =>
    userApi.getAddresses().then((res) => {
      setAddresses(res.data)
      setLoading(false)
    })

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setModal({ mode: 'add' })
  }

  const openEdit = (address) => {
    setForm({
      label: address.label || '',
      recipient: address.recipient || '',
      phone: address.phone || '',
      province: address.province || '',
      city: address.city || '',
      district: address.district || '',
      street: address.street || '',
      postal_code: address.postal_code || '',
      is_default: Boolean(address.is_default),
    })
    setErrors({})
    setModal({ mode: 'edit', address })
  }

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const save = async () => {
    const required = ['label', 'recipient', 'phone', 'province', 'city', 'district', 'street']
    const missing = {}
    required.forEach((k) => {
      if (!form[k]?.trim()) missing[k] = 'Wajib diisi'
    })
    if (Object.keys(missing).length) {
      setErrors(missing)
      showToast('Lengkapi semua kolom wajib', 'error')
      return
    }

    setSaving(true)
    try {
      if (modal.mode === 'add') {
        await userApi.addAddress(form)
        showToast('Alamat ditambahkan 🎉')
      } else {
        await userApi.updateAddress(modal.address.id, form)
        showToast('Alamat diperbarui ✨')
      }
      setModal(null)
      await load()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan alamat'
      showToast(msg, 'error')
      const fieldErrors = err?.response?.data?.errors
      if (fieldErrors) setErrors(fieldErrors)
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async (address) => {
    await userApi.setDefault(address.id)
    setAddresses((list) => list.map((a) => ({ ...a, is_default: a.id === address.id })))
    showToast('Alamat utama diperbarui')
  }

  const sorted = useMemo(() => {
    return [...addresses].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
  }, [addresses])

  if (loading) return <Loading label="Memuat alamat..." />

  return (
    <div className="page-container max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <span className="page-eyebrow">Akun & pengaturan</span>
          <h1 className="page-title">Buku Alamat</h1>
          <p className="page-subtitle">Kelola alamat pengiriman untuk pesanan dan jasa berkebun.</p>
        </div>
        <Button onClick={openAdd}>＋ Tambah alamat</Button>
      </div>

      <div className="mt-8 space-y-4">
        {sorted.length === 0 ? (
          <EmptyState
            icon="📍"
            title="Belum ada alamat"
            description="Tambahkan alamat pengiriman agar checkout dan pemesanan jasa lebih cepat."
            actionLabel="Tambahkan alamat"
            onAction={openAdd}
          />
        ) : (
          sorted.map((a) => (
            <div
              key={a.id}
              className={cx(
                'rounded-3xl border bg-white p-5 shadow-soft transition',
                a.is_default ? 'border-leaf-300 ring-1 ring-leaf-200' : 'border-leaf-100',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-xl">
                    {['Rumah', 'Rumah Utama'].includes(a.label) ? '🏠' : ['Kantor'].includes(a.label) ? '🏢' : '📍'}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-forest">{a.label}</p>
                      {a.is_default && (
                        <Badge className="bg-leaf-600 text-white" icon="⭐">
                          Utama
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-leaf-900/60">
                      {a.recipient} · {a.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!a.is_default && (
                    <Button size="xs" variant="soft" onClick={() => handleSetDefault(a)}>
                      Jadikan utama
                    </Button>
                  )}
                  <Button size="xs" variant="secondary" onClick={() => openEdit(a)}>
                    Edit
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-forest/80">
                {a.street}, {a.district}, {a.city}, {a.province} {a.postal_code || ''}
              </p>
              {a.created_at && <p className="mt-2 text-[11px] text-leaf-900/40">Ditambahkan {formatDate(a.created_at)}</p>}
            </div>
          ))
        )}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Ubah alamat' : 'Tambah alamat'}
        footer={
          <div className="flex w-full gap-3">
            <Button variant="ghost" onClick={() => setModal(null)} className="flex-1">
              Batal
            </Button>
            <Button variant="primary" onClick={save} loading={saving} className="flex-1">
              {modal?.mode === 'edit' ? 'Simpan perubahan' : 'Tambahkan'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Label *" placeholder="Rumah / Kantor / Lainnya"
            value={form.label} error={errors.label} onChange={(e) => setField('label', e.target.value)} />
          <Input label="Nama penerima *" placeholder="Nama lengkap"
            value={form.recipient} error={errors.recipient} onChange={(e) => setField('recipient', e.target.value)} />
          <Input label="No. HP *" placeholder="08xx-xxxx-xxxx"
            value={form.phone} error={errors.phone} onChange={(e) => setField('phone', e.target.value)} />
          <Input label="Kode pos" placeholder="e.g. 12540"
            value={form.postal_code} onChange={(e) => setField('postal_code', e.target.value)} />
          <Input label="Provinsi *" placeholder="DKI Jakarta"
            value={form.province} error={errors.province} onChange={(e) => setField('province', e.target.value)} />
          <Input label="Kota/Kabupaten *" placeholder="Jakarta Selatan"
            value={form.city} error={errors.city} onChange={(e) => setField('city', e.target.value)} />
          <Input label="Kecamatan *" placeholder="Tebet"
            value={form.district} error={errors.district} onChange={(e) => setField('district', e.target.value)} />
          <Input label="Alamat lengkap *" placeholder="Jl. ..., RT/RW, kelurahan"
            wrapperClassName="sm:col-span-2" value={form.street} error={errors.street}
            onChange={(e) => setField('street', e.target.value)} />
          <label className="flex items-center gap-2.5 text-sm font-medium text-leaf-900 sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-leaf-600"
              checked={form.is_default}
              onChange={(e) => setField('is_default', e.target.checked)}
            />
            Jadikan sebagai alamat utama
          </label>
        </div>
      </Modal>
    </div>
  )
}
