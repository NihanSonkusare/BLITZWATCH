'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, Bookmark, BarChart2, Film, Users, TrendingUp, Settings,
  Bell, Search, LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

// ── Theater Sidebar (Employee) ─────────────────────────────────────────────────
const THEATER_NAV = [
  { label: 'Browse', icon: Home, href: '/app/theater' },
  { label: 'My Assignments', icon: Bookmark, href: '/app/assignments' },
  { label: 'My Stats', icon: BarChart2, href: '/app/stats' },
]

export function TheaterSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        id="theater-sidebar"
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 border-r border-white/5 bg-[#0A0A0F] transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/5">
          {!collapsed && (
            <Link href="/app/theater" className="font-display text-xl text-[#E8FF47] tracking-widest">
              BLITZWATCH
            </Link>
          )}
          {collapsed && (
            <span className="font-display text-lg text-[#E8FF47] mx-auto">B</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {THEATER_NAV.map(({ label, icon: Icon, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                id={`sidebar-${label.replace(/\s/g, '-').toLowerCase()}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-btn transition-all duration-150 group ${
                  active
                    ? 'bg-[#E8FF47]/10 text-[#E8FF47]'
                    : 'text-[#8888A0] hover:text-[#F0F0F8] hover:bg-white/5'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{label}</span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-[#E8FF47]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 px-3 py-3 mx-2 mb-4 rounded-btn text-[#44445A] hover:text-[#8888A0] hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A0A0F]/95 backdrop-blur border-t border-white/5 flex">
        {THEATER_NAV.map(({ label, icon: Icon, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                active ? 'text-[#E8FF47]' : 'text-[#44445A]'
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

// ── Studio Sidebar (HR) ────────────────────────────────────────────────────────
const STUDIO_NAV = [
  { label: 'Content Studio', icon: Film, href: '/hr/studio' },
  { label: 'Casting & Avatars', icon: Users, href: '/hr/casting' },
  { label: 'Analytics', icon: TrendingUp, href: '/hr/analytics' },
  { label: 'User Management', icon: Settings, href: '/hr/users' },
]

export function StudioSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {STUDIO_NAV.map(({ label, icon: Icon, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            id={`studio-nav-${label.replace(/[\s&]/g, '-').toLowerCase()}`}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-btn transition-all duration-150 ${
              active
                ? 'bg-[#5B4EFF]/10 text-[#5B4EFF]'
                : 'text-[#555566] hover:text-[#111118] hover:bg-[#5B4EFF]/5'
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
            {active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5B4EFF]" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop */}
      <aside
        id="studio-sidebar"
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 w-64 border-r border-[#E5E5EF] bg-white"
      >
        <div className="flex items-center h-16 px-5 border-b border-[#E5E5EF]">
          <Link href="/hr/studio" className="font-display text-xl text-[#111118] tracking-widest">
            BLITZWATCH
          </Link>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#5B4EFF] bg-[#5B4EFF]/10 px-2 py-0.5 rounded-pill">
            Studio
          </span>
        </div>
        <NavContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        id="studio-mobile-menu-btn"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-btn bg-white border border-[#E5E5EF] shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E5EF] flex flex-col">
            <div className="flex items-center h-16 px-5 border-b border-[#E5E5EF]">
              <span className="font-display text-xl text-[#111118] tracking-widest">BLITZWATCH</span>
            </div>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}

// ── Top Navigation Bar ────────────────────────────────────────────────────────
interface NavBarProps {
  theme: 'theater' | 'studio'
  userEmail?: string
}

export function NavBar({ theme, userEmail }: NavBarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [searchFocused, setSearchFocused] = useState(false)

  const isTheater = theme === 'theater'

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      id="top-navbar"
      className={`fixed top-0 right-0 z-20 h-16 flex items-center px-6 gap-4 border-b transition-all duration-300 ${
        isTheater
          ? 'left-0 lg:left-60 bg-[#0A0A0F]/80 backdrop-blur border-white/5'
          : 'left-0 lg:left-64 bg-white/90 backdrop-blur border-[#E5E5EF]'
      }`}
    >
      {/* Search bar */}
      <div className={`flex-1 max-w-md mx-auto hidden md:block`}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-pill border transition-all duration-200 ${
            isTheater
              ? `border-white/10 bg-white/5 ${searchFocused ? 'border-[#E8FF47]/40 bg-white/8' : ''}`
              : `border-[#E5E5EF] bg-[#F8F8FB] ${searchFocused ? 'border-[#5B4EFF]/40' : ''}`
          }`}
        >
          <Search size={14} className={isTheater ? 'text-[#44445A]' : 'text-[#9999AA]'} />
          <input
            id="global-search"
            type="text"
            placeholder="Search modules, episodes…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`flex-1 bg-transparent text-sm outline-none ${
              isTheater
                ? 'text-[#F0F0F8] placeholder-[#44445A]'
                : 'text-[#111118] placeholder-[#9999AA]'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button
          id="notification-bell"
          className={`relative p-2 rounded-btn transition-colors ${
            isTheater ? 'hover:bg-white/5 text-[#8888A0]' : 'hover:bg-[#F8F8FB] text-[#555566]'
          }`}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4747] animate-pulse" />
        </button>

        {/* Avatar + sign out */}
        <div className="flex items-center gap-2">
          <div
            id="user-avatar"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              isTheater
                ? 'bg-[#E8FF47]/20 text-[#E8FF47]'
                : 'bg-[#5B4EFF]/20 text-[#5B4EFF]'
            }`}
          >
            {userEmail?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <button
            id="sign-out-btn"
            onClick={handleSignOut}
            className={`p-2 rounded-btn transition-colors ${
              isTheater ? 'hover:bg-white/5 text-[#44445A]' : 'hover:bg-[#F8F8FB] text-[#9999AA]'
            }`}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
