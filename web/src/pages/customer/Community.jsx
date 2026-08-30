import { useEffect, useState } from 'react'
import { communityApi } from '../../services/api/community'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { timeAgo } from '../../utils/format'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import ProductVisual from '../../components/product/ProductVisual'
import { cx } from '../../utils/format'

const moods = [
  { emoji: '🌿', gradient: 'from-leaf-400 to-emerald-600', label: 'Tanaman baru' },
  { emoji: '🌶️', gradient: 'from-red-500 to-rose-700', label: 'Panen' },
  { emoji: '🪴', gradient: 'from-rose-300 to-red-500', label: 'Tips' },
  { emoji: '🌵', gradient: 'from-emerald-400 to-teal-600', label: 'Kebunku' },
  { emoji: '🍅', gradient: 'from-orange-400 to-red-600', label: 'Resep' },
]

export default function Community() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [composer, setComposer] = useState(false)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(moods[0])
  const [sending, setSending] = useState(false)
  const [commentFor, setCommentFor] = useState(null)
  const [commentText, setCommentText] = useState('')
  const { user } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    communityApi.getPosts().then((res) => {
      setPosts(res.data)
      setLoading(false)
    })
  }, [])

  const like = async (id) => {
    await communityApi.toggleLike(id)
    const res = await communityApi.getPosts()
    setPosts(res.data)
  }

  const submitComment = async (id) => {
    if (!commentText.trim()) return
    await communityApi.addComment(id, commentText.trim())
    showToast('Komentar terkirim 💬')
    setCommentFor(null)
    setCommentText('')
    const res = await communityApi.getPosts()
    setPosts(res.data)
  }

  const submit = async () => {
    if (!content.trim()) return
    setSending(true)
    await communityApi.createPost({ content: content.trim(), emoji: mood.emoji, gradient: mood.gradient })
    setSending(false)
    setComposer(false)
    setContent('')
    showToast('Post berhasil dibagikan! 🌱')
    const res = await communityApi.getPosts()
    setPosts(res.data)
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="page-hero flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="page-eyebrow">Berkebun bersama</span>
          <h1 className="page-title">Komunitas Tanamanku</h1>
          <p className="page-subtitle">Berbagi, belajar, dan saling mendukung sesama pekebun.</p>
        </div>
        <Button onClick={() => setComposer(true)} className="hidden sm:inline-flex">✍️ Tulis post</Button>
      </div>

      {/* Composer */}
      {composer && (
        <div className="card-v2 mt-6 animate-pop rounded-2xl p-5 hover:-translate-y-0">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl">
              {user?.avatar || '🧑‍🌾'}
            </span>              <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bagikan cerita, hasil panen, atau tips berkebunmu..."
              rows={3}
              className="flex-1 resize-none rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-input)] p-3.5 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m)}
                  title={m.label}
                  className={cx(
                    'flex h-9 w-9 items-center justify-center rounded-xl border-2 transition',
                    mood.emoji === m.emoji ? 'scale-110 border-leaf-600' : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setComposer(false)}>Batal</Button>
              <Button size="sm" onClick={submit} loading={sending} disabled={!content.trim()}>
                Bagikan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <Loading />
        ) : (
          posts.map((post) => (
            <article key={post.id} className="animate-fade-up overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm">
              <div className="flex items-center gap-3 p-5 pb-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-800/20 text-xl">{post.avatar}</span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{post.author}</p>
                  <p className="text-xs text-[var(--text-muted)]">{timeAgo(post.time)}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="leading-relaxed text-[var(--text-secondary)]">{post.content}</p>
                {post.emoji && (
                  <div className="mt-4">
                    <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-48 w-full rounded-2xl" emojiClassName="text-7xl" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 border-t border-leaf-100 px-5 py-3">
                <button
                  onClick={() => like(post.id)}
                  className={cx('flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition', post.liked ? 'text-rose-600' : 'text-leaf-900/50 hover:bg-leaf-50')}
                >
                  {post.liked ? '❤️' : '🤍'} {post.likes}
                </button>
                <button onClick={() => setCommentFor(commentFor === post.id ? null : post.id)} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-leaf-900/50 transition hover:bg-leaf-50">
                  💬 {post.comments.length}
                </button>
                <span className="ml-auto text-xs text-[var(--text-muted)]">Tanamanku</span>
              </div>
              {commentFor === post.id && (
                <div className="flex items-center gap-2 border-t border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-3">
                  <input
                    autoFocus
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                    placeholder="Tulis komentar... (Enter untuk kirim)"
                    className="flex-1 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
                  />
                  <Button size="sm" onClick={() => submitComment(post.id)} disabled={!commentText.trim()}>
                    Kirim
                  </Button>
                </div>
              )}
              {post.comments.length > 0 && (
                <div className="space-y-3 bg-[var(--bg-card)] px-5 py-4">
                  {post.comments.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-card-hover)] text-sm shadow-sm">{c.avatar}</span>
                      <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{c.author} <span className="font-normal text-[var(--text-muted)]">· {timeAgo(c.time)}</span></p>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {!loading && (
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => setComposer(true)}>✍️ Tulis post pertamamu</Button>
        </div>
      )}
    </div>
  )
}
