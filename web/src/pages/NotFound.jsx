import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="animate-float text-7xl">🍂</div>
      <h1 className="mt-6 text-6xl font-extrabold text-leaf-700">404</h1>
      <p className="mt-3 max-w-sm text-leaf-900/60">
        Sepertinya halaman ini sudah dipetik. Kembali ke kebun utama yuk!
      </p>
      <div className="mt-8 flex gap-3">
        <Button to="/">← Beranda</Button>
        <Button to="/explore" variant="secondary">Jelajahi produk</Button>
      </div>
    </div>
  )
}
