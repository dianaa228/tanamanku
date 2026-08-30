import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileNavigation from './MobileNavigation'
import ScrollToTop from '../ui/ScrollToTop'
import { cx } from '../../utils/format'

export default function PublicLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div className={cx('flex min-h-screen flex-col', isDark && 'dark')}>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  )
}
