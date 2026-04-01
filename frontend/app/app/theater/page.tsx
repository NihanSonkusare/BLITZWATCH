'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Play, Bookmark, Clock, ChevronRight } from 'lucide-react'

// ── Demo data ──────────────────────────────────────────────────────────────────
const HERO = {
  id: 'ep-001',
  title: 'DATA SECURITY ESSENTIALS',
  moduleId: 'mod-001',
  runtime: '2m 30s',
  episodes: 5,
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 36), // 36 hours from now
  gradient: 'from-[#0A0A0F] via-[#0D0D18] to-transparent',
}

interface CardData {
  id: string; title: string; duration: string; progress?: number; badge?: string; thumb?: string
}

const CONTINUE: CardData[] = [
  { id: 'ep-002', title: 'GDPR Compliance Basics', duration: '28s', progress: 72 },
  { id: 'ep-003', title: 'Phishing Attack Tactics', duration: '30s', progress: 40 },
  { id: 'ep-004', title: 'Safe Password Practices', duration: '25s', progress: 15 },
]

const MANDATORY: CardData[] = [
  { id: 'ep-005', title: 'Workplace Harassment Policy', duration: '30s', badge: 'DUE APR 5' },
  { id: 'ep-006', title: 'Fire Safety Procedures', duration: '28s', badge: 'DUE APR 8' },
  { id: 'ep-007', title: 'Return to Work Guidelines', duration: '30s', badge: 'DUE APR 15' },
  { id: 'ep-008', title: 'Data Handling Protocol', duration: '26s', badge: 'DUE APR 20' },
]

const RECAPS: CardData[] = [
  { id: 'ep-009', title: 'Two-Factor Authentication', duration: '30s' },
  { id: 'ep-010', title: 'Clean Desk Policy', duration: '22s' },
  { id: 'ep-011', title: 'Email Etiquette', duration: '28s' },
  { id: 'ep-012', title: 'VPN Usage Guide', duration: '30s' },
]

const ACCENT_COLORS = ['from-[#E8FF47]/20', 'from-[#5B4EFF]/20', 'from-[#47FF9E]/20', 'from-[#FF4747]/20']

// ── Episode Card ──────────────────────────────────────────────────────────────
function EpisodeCard({ card, index }: { card: CardData; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isUrgent = card.badge && (card.badge.includes('APR 2') || card.badge.includes('APR 3'))

  return (
    <Link
      href={`/app/watch/${card.id}`}
      id={`episode-card-${card.id}`}
      className="relative flex-shrink-0 w-40 rounded-card overflow-hidden cursor-pointer block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        boxShadow: hovered ? '0 0 20px rgba(232,255,71,0.15)' : 'none',
        transition: 'transform 150ms ease-out, box-shadow 150ms ease-out',
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* Thumbnail */}
      <div className={`h-24 bg-gradient-to-br ${ACCENT_COLORS[index % ACCENT_COLORS.length]} to-[#111118] relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full bg-[#E8FF47]/20 flex items-center justify-center transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <Play size={12} fill="#E8FF47" className="text-[#E8FF47] ml-0.5" />
          </div>
        </div>
        {/* Progress bar */}
        {card.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
            <div className="h-full bg-[#E8FF47]" style={{ width: `${card.progress}%` }} />
          </div>
        )}
        {/* Deadline badge */}
        {card.badge && (
          <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-pill text-[9px] font-bold uppercase tracking-wider ${
            isUrgent ? 'bg-[#FF4747] text-white animate-pulse' : 'bg-[#0A0A0F]/80 text-[#FFB347]'
          }`}>
            {card.badge}
          </div>
        )}
        {/* Duration */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-pill bg-[#0A0A0F]/70 text-[9px] font-mono text-[#F0F0F8]">
          {card.duration}
        </div>
      </div>

      {/* Card info */}
      <div className="p-2 bg-[#111118]">
        <p className="text-[11px] font-semibold text-[#F0F0F8] leading-tight line-clamp-2">{card.title}</p>
      </div>
    </Link>
  )
}

// ── Carousel Row ──────────────────────────────────────────────────────────────
function CarouselRow({ title, cards }: { title: string; cards: CardData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startX.current = e.pageX - scrollRef.current!.offsetLeft
    scrollLeft.current = scrollRef.current!.scrollLeft
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const x = e.pageX - scrollRef.current!.offsetLeft
    scrollRef.current!.scrollLeft = scrollLeft.current - (x - startX.current)
  }
  const onMouseUp = () => setIsDragging(false)

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-[#F0F0F8]">{title}</h2>
        <ChevronRight size={14} className="text-[#44445A]" />
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 px-6 lg:px-8 overflow-x-auto scrollbar-hide select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {cards.map((card, i) => <EpisodeCard key={card.id} card={card} index={i} />)}
      </div>
    </div>
  )
}

// ── Theater Home Page ─────────────────────────────────────────────────────────
export default function TheaterPage() {
  const [heroHovered, setHeroHovered] = useState(false)
  const isUrgent = HERO.deadline.getTime() - Date.now() < 48 * 60 * 60 * 1000

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div
        id="hero-banner"
        className="relative h-[420px] lg:h-[480px] overflow-hidden"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >
        {/* Background with ken-burns */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#111118] via-[#0D0D1A] to-[#0A0A0F]"
          style={{
            animation: heroHovered ? 'none' : 'kenBurns 20s ease-in-out infinite',
          }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(91,78,255,0.3) 0%, transparent 60%)',
            }}
          />
          {/* Decorative lines */}
          <div className="absolute top-12 right-20 w-48 h-48 rounded-full border border-[#E8FF47]/10" />
          <div className="absolute top-20 right-16 w-32 h-32 rounded-full border border-[#E8FF47]/5" />
        </div>

        {/* Gradient overlay — text reads clearly on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end pb-12 px-6 lg:px-8 max-w-2xl">
          {/* Category */}
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#E8FF47] mb-4">
            Featured Module
          </span>

          {/* Title */}
          <h1 className="font-display text-5xl lg:text-7xl text-[#F0F0F8] leading-none mb-4">
            {HERO.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-[#8888A0]">
              <Clock size={11} />
              {HERO.runtime}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#44445A]" />
            <span className="text-xs text-[#8888A0]">{HERO.episodes} episodes</span>
            <span className="w-1 h-1 rounded-full bg-[#44445A]" />
            <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wider ${
              isUrgent ? 'bg-[#FF4747] text-white animate-pulse' : 'bg-[#FFB347]/20 text-[#FFB347]'
            }`}>
              Due {HERO.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href={`/app/watch/${HERO.id}`}
              id="hero-play-btn"
              className="flex items-center gap-2 px-6 py-3 bg-[#E8FF47] text-[#0A0A0F] font-bold text-sm rounded-btn hover:opacity-90 active:scale-95 transition-all"
            >
              <Play size={15} fill="#0A0A0F" />
              Play Episode 1
            </Link>
            <button
              id="hero-add-list-btn"
              className="flex items-center gap-2 px-5 py-3 border border-white/20 text-[#F0F0F8] font-semibold text-sm rounded-btn hover:bg-white/10 transition-colors"
            >
              <Bookmark size={15} />
              Add to List
            </button>
          </div>
        </div>
      </div>

      {/* ── Carousels ───────────────────────────────────────────────── */}
      <div className="py-8">
        <CarouselRow title="Continue Watching" cards={CONTINUE} />
        <CarouselRow title="Up Next — Mandatory" cards={MANDATORY} />
        <CarouselRow title="Bite-Sized Recaps" cards={RECAPS} />
      </div>

      <style jsx global>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0, 0); }
          50%  { transform: scale(1.04) translate(-1%, -0.5%); }
          100% { transform: scale(1)    translate(0, 0); }
        }
      `}</style>
    </div>
  )
}
