'use client'

import { use } from 'react'
import VideoPlayer from '@/components/ui/VideoPlayer'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'

// Demo episode metadata (replaced by Supabase in production)
const EPISODES: Record<string, { title: string; description: string; moduleTitle: string }> = {
  'ep-001': { title: 'Episode 1: The Threat Landscape', moduleTitle: 'Data Security Essentials', description: 'Understand the modern threat landscape and why data security matters for every employee.' },
  'ep-002': { title: 'GDPR Compliance Basics', moduleTitle: 'Legal & Compliance', description: 'The key principles of GDPR and how they affect your daily work.' },
}

interface WatchPageProps {
  params: Promise<{ episodeId: string }>
}

export default function WatchPage({ params }: WatchPageProps) {
  const { episodeId } = use(params)
  const episode = EPISODES[episodeId]

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Back nav */}
      <div className="px-6 lg:px-8 py-4">
        <Link
          href="/app/theater"
          id="back-to-theater"
          className="inline-flex items-center gap-2 text-[#8888A0] hover:text-[#F0F0F8] transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          Back to Theater
        </Link>
      </div>

      {/* Main content */}
      <div className="px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
        {/* Player */}
        <VideoPlayer
          episodeId={episodeId}
          src={undefined} // Connect to real video URL in production
        />

        {/* Episode info */}
        <div className="mt-6 flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8FF47]">
                {episode?.moduleTitle ?? 'Training Module'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#F0F0F8] mb-2">
              {episode?.title ?? `Episode ${episodeId}`}
            </h1>
            <p className="text-[#8888A0] text-sm leading-relaxed">
              {episode?.description ?? 'Watch this episode to complete your assigned training.'}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-xs text-[#44445A]">
                <Clock size={12} />
                30 seconds
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#44445A]">
                <BookOpen size={12} />
                2 quiz questions
              </span>
            </div>
          </div>
        </div>

        {/* Up next */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-[#F0F0F8] mb-4">Up Next</h2>
          <div className="space-y-3">
            {['ep-005', 'ep-006', 'ep-007'].map((id) => (
              <Link
                key={id}
                href={`/app/watch/${id}`}
                id={`up-next-${id}`}
                className="flex items-center gap-4 p-3 rounded-card bg-[#111118] border border-white/5 hover:border-[#E8FF47]/20 hover:bg-[#111120] transition-all group"
              >
                <div className="w-20 h-12 rounded-btn bg-[#1A1A24] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8FF47]/10 transition-colors">
                  <span className="text-[#E8FF47] text-xs">▶</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F0F0F8]">{EPISODES[id]?.title ?? `Episode ${id}`}</p>
                  <p className="text-[11px] text-[#44445A] mt-0.5">30s</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
