import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '403 — Access Denied' }

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-4">
      <span className="font-display text-8xl text-[#FF4747]/30">403</span>
      <h1 className="font-display text-3xl text-[#F0F0F8]">ACCESS DENIED</h1>
      <p className="text-[#8888A0] text-sm">You don&apos;t have permission to view this page.</p>
      <Link href="/login" className="mt-4 px-5 py-2.5 bg-[#E8FF47] text-[#0A0A0F] font-bold text-sm rounded-btn hover:opacity-90 transition-opacity">
        Back to Login
      </Link>
    </main>
  )
}
