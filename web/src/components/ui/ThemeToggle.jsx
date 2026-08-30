import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        isDark
          ? 'bg-leaf-800/50 text-sun-300 hover:bg-leaf-700/50'
          : 'bg-leaf-800/20 text-leaf-300 hover:bg-leaf-700/30'
      } ${className}`}
      aria-label={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      <span className="text-lg transition-transform duration-300 group-hover:rotate-12">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Terang' : 'Gelap'}</span>
    </button>
  )
}
