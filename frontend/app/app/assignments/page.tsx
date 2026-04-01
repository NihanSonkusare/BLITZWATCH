'use client'

import Link from 'next/link'
import { BookOpen, Bookmark, Clock, ChevronRight } from 'lucide-react'

const ASSIGNMENTS = [
  { id: 'ep-005', title: 'Workplace Harassment Policy', module: 'HR Policies 2025', deadline: 'Apr 5', urgent: true, progress: 0 },
  { id: 'ep-002', title: 'GDPR Compliance Basics', module: 'Legal & Compliance', deadline: 'Apr 8', urgent: false, progress: 72 },
  { id: 'ep-006', title: 'Fire Safety Procedures', module: 'Health & Safety', deadline: 'Apr 8', urgent: false, progress: 0 },
  { id: 'ep-007', title: 'Return to Work Guidelines', module: 'HR Policies 2025', deadline: 'Apr 15', urgent: false, progress: 40 },
  { id: 'ep-004', title: 'Safe Password Practices', module: 'Data Security Essentials', deadline: 'Apr 20', urgent: false, progress: 100 },
]

export default function AssignmentsPage() {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark size={16} className="text-[#E8FF47]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E8FF47]">My Assignments</span>
        </div>
        <h1 className="text-4xl font-display text-[#F0F0F8]">YOUR QUEUE</h1>
        <p className="text-[#8888A0] text-sm mt-1">{ASSIGNMENTS.filter(a => a.progress < 100).length} remaining</p>
      </div>

      <div className="space-y-3">
        {ASSIGNMENTS.map((a) => (
          <Link
            key={a.id}
            href={`/app/watch/${a.id}`}
            id={`assignment-${a.id}`}
            className="flex items-center gap-4 p-4 rounded-card bg-[#111118] border border-white/5 hover:border-[#E8FF47]/20 hover:bg-[#111120] transition-all group"
          >
            {/* Thumb */}
            <div className={`w-16 h-10 rounded-btn flex-shrink-0 flex items-center justify-center ${
              a.progress === 100 ? 'bg-[#47FF9E]/10' : 'bg-[#1A1A24]'
            }`}>
              {a.progress === 100
                ? <span className="text-[#47FF9E] text-base">✓</span>
                : <BookOpen size={14} className="text-[#44445A]" />
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-[#F0F0F8] truncate">{a.title}</p>
                {a.urgent && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 rounded-pill text-[9px] font-bold bg-[#FF4747] text-white animate-pulse">URGENT</span>
                )}
              </div>
              <p className="text-[11px] text-[#44445A]">{a.module}</p>

              {/* Progress bar */}
              {a.progress > 0 && a.progress < 100 && (
                <div className="mt-2 h-0.5 bg-[#1A1A24] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8FF47]" style={{ width: `${a.progress}%` }} />
                </div>
              )}
            </div>

            {/* Deadline + arrow */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-1 text-[11px] text-[#44445A] mb-1">
                <Clock size={10} />
                <span>{a.deadline}</span>
              </div>
              <ChevronRight size={14} className="text-[#44445A] ml-auto group-hover:text-[#E8FF47] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
