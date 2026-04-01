'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

// ── Login Page ────────────────────────────────────────────────────────────────
// Split-screen: Theater (dark) on the left, Studio (light) on the right.
// A unified form floats in the center, crossing the boundary.

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
        if (authError) throw authError

        // Get role and redirect
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Login failed')

        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'hr') {
          router.push('/hr/studio')
        } else {
          router.push('/app/theater')
        }
        router.refresh()
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'employee' },
          },
        })
        if (authError) throw authError
        setError('Check your email to confirm your account.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex overflow-hidden" id="login-page">
      {/* ── Left half — Theater dark ──────────────────────────────────── */}
      <div className="flex-1 relative bg-[#0A0A0F] flex flex-col items-start justify-center px-16 pb-24">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#F0F0F8 1px, transparent 1px), linear-gradient(90deg, #F0F0F8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-[#E8FF47]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8FF47] font-mono">
              Employee Portal
            </span>
          </div>
          <h2 className="font-display text-6xl text-[#F0F0F8] leading-none mb-4">
            THE<br />THEATER
          </h2>
          <p className="text-[#8888A0] text-sm leading-relaxed">
            Watch your personalized training episodes. 30-second stories, starring your colleagues.
          </p>

          {/* Decorative episode cards */}
          <div className="mt-10 space-y-3">
            {[
              { title: 'Data Security 101', duration: '30s', progress: 75 },
              { title: 'Onboarding: Day One', duration: '28s', progress: 0 },
            ].map((ep) => (
              <div key={ep.title} className="flex items-center gap-3 p-3 rounded-card bg-[#111118] border border-white/5">
                <div className="w-14 h-9 rounded-[6px] bg-[#1A1A24] flex-shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8FF47]/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#E8FF47] text-xs">▶</span>
                  </div>
                  {ep.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A24]">
                      <div className="h-full bg-[#E8FF47]" style={{ width: `${ep.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F0F0F8] text-xs font-semibold truncate">{ep.title}</p>
                  <p className="text-[#8888A0] text-[10px]">{ep.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right half — Studio light ─────────────────────────────────── */}
      <div className="flex-1 relative bg-[#F8F8FB] flex flex-col items-end justify-center px-16 pb-24">
        <div className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 30%, #5B4EFF10 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 max-w-md w-full ml-auto">
          <div className="mb-10 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5B4EFF] font-mono">
              HR Admin Portal
            </span>
          </div>
          <h2 className="font-display text-6xl text-[#111118] leading-none mb-4 text-right">
            THE<br />STUDIO
          </h2>
          <p className="text-[#555566] text-sm leading-relaxed text-right">
            Upload training PDFs, cast your employees as AI avatars, and publish episodes in minutes.
          </p>

          {/* Decorative stat pills */}
          <div className="mt-10 flex flex-wrap gap-2 justify-end">
            {[
              { label: 'Episodes published', value: '24' },
              { label: 'Avg completion', value: '82%' },
              { label: 'Quiz accuracy', value: '71%' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white border border-[#E5E5EF]">
                <span className="text-[#5B4EFF] font-bold text-sm">{stat.value}</span>
                <span className="text-[#555566] text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Center floating card — login form ────────────────────────── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-20 px-4">
        <div className="bg-[#111118]/95 backdrop-blur-xl border border-white/10 rounded-modal p-8 shadow-2xl shadow-black/60">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="font-display text-3xl text-[#E8FF47] tracking-widest">BLITZWATCH</span>
            <p className="text-[#8888A0] text-xs mt-1">Training, reimagined.</p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-btn overflow-hidden border border-white/10 mb-6 p-0.5 bg-[#0A0A0F]">
            {(['login', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                id={`auth-tab-${tab}`}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 text-xs font-semibold rounded-[6px] transition-all duration-200 ${
                  mode === tab
                    ? 'bg-[#E8FF47] text-[#0A0A0F]'
                    : 'text-[#8888A0] hover:text-[#F0F0F8]'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8888A0] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-input text-[#F0F0F8] text-sm placeholder-[#44445A] focus:outline-none focus:border-[#E8FF47]/60 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8888A0] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0A0A0F] border border-white/10 rounded-input text-[#F0F0F8] text-sm placeholder-[#44445A] focus:outline-none focus:border-[#E8FF47]/60 transition-colors"
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-[#FF4747]/10 border border-[#FF4747]/30 rounded-btn">
                <p className="text-[#FF4747] text-xs">{error}</p>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#E8FF47] text-[#0A0A0F] font-bold text-sm rounded-btn hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F] rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {mode === 'login' && (
              <p className="text-center text-xs text-[#44445A]">
                <button type="button" className="text-[#8888A0] hover:text-[#E8FF47] transition-colors">
                  Forgot password?
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}
