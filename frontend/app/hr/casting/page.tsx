'use client'

import { useState } from 'react'
import { Users, Plus, CheckCircle, AlertCircle, Upload, X, Camera } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

interface CastMember {
  id: string; name: string; department: string; hasHeadshot: boolean; quality: boolean
}

// Demo employees
const DEMO_CAST: CastMember[] = [
  { id: '1', name: 'Alex Chen', department: 'Engineering', hasHeadshot: true, quality: true },
  { id: '2', name: 'Sarah Kim', department: 'Sales', hasHeadshot: true, quality: true },
  { id: '3', name: 'James Rowe', department: 'Finance', hasHeadshot: false, quality: false },
  { id: '4', name: 'Priya Sharma', department: 'HR', hasHeadshot: true, quality: false },
  { id: '5', name: 'Tom Walker', department: 'Marketing', hasHeadshot: false, quality: false },
  { id: '6', name: 'Luna Park', department: 'Operations', hasHeadshot: true, quality: true },
  { id: '7', name: 'David Ortiz', department: 'Engineering', hasHeadshot: true, quality: true },
  { id: '8', name: 'Emma Lewis', department: 'Sales', hasHeadshot: false, quality: false },
]

export default function CastingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uploadModal, setUploadModal] = useState<CastMember | null>(null)
  const [search, setSearch] = useState('')

  const filtered = DEMO_CAST.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#5B4EFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#5B4EFF]">Casting & Avatars</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111118]">Casting Directory</h1>
          <p className="text-[#555566] text-sm mt-1">Select employees to cast as AI avatars in your episodes.</p>
        </div>

        {selected.size > 0 && (
          <button
            id="cast-selected-btn"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5B4EFF] text-white text-sm font-semibold rounded-btn hover:opacity-90 transition-opacity"
            onClick={() => toast(`${selected.size} employee(s) selected for casting`, 'success')}
          >
            <Camera size={15} />
            Cast {selected.size} Selected
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          id="cast-search"
          type="text"
          placeholder="Search by name or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 bg-white border border-[#E5E5EF] rounded-btn text-sm text-[#111118] placeholder-[#9999AA] focus:outline-none focus:border-[#5B4EFF]/60 transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((member) => {
          const isSelected = selected.has(member.id)
          return (
            <button
              key={member.id}
              id={`cast-card-${member.id}`}
              onClick={() => toggleSelect(member.id)}
              className={`relative flex flex-col items-center p-5 rounded-card border-2 text-center transition-all duration-150 hover:shadow-sm bg-white ${
                isSelected
                  ? 'border-[#5B4EFF] shadow-[0_0_0_3px_rgba(91,78,255,0.15)]'
                  : 'border-[#E5E5EF] hover:border-[#5B4EFF]/40'
              }`}
            >
              {/* Selection check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#5B4EFF] flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}

              {/* Avatar circle */}
              <div className="relative w-16 h-16 rounded-full mb-3">
                {member.hasHeadshot ? (
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-xl font-bold ${
                    member.quality ? 'bg-gradient-to-br from-[#5B4EFF]/30 to-[#E8FF47]/20 text-[#5B4EFF]' : 'bg-[#F0F0F0] text-[#9999AA]'
                  }`}>
                    {member.name[0]}
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-[#F8F8FB] border-2 border-dashed border-[#E5E5EF] flex items-center justify-center text-[#C0C0D0]">
                    <Plus size={18} />
                  </div>
                )}
                {/* Quality badge */}
                <div className="absolute -bottom-1 -right-1">
                  {member.quality ? (
                    <CheckCircle size={16} className="text-[#22C55E] bg-white rounded-full" />
                  ) : member.hasHeadshot ? (
                    <AlertCircle size={16} className="text-[#F59E0B] bg-white rounded-full" />
                  ) : null}
                </div>
              </div>

              <p className="text-sm font-semibold text-[#111118] leading-tight">{member.name}</p>
              <p className="text-[10px] text-[#9999AA] mt-0.5">{member.department}</p>

              {/* Status badge */}
              <div className={`mt-2 px-2 py-0.5 rounded-pill text-[10px] font-bold ${
                member.quality
                  ? 'bg-[#22C55E]/10 text-[#22C55E]'
                  : member.hasHeadshot
                  ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'bg-[#E5E5EF] text-[#9999AA]'
              }`}>
                {member.quality ? 'Ready' : member.hasHeadshot ? 'Low Quality' : 'No Headshot'}
              </div>

              {/* Upload button */}
              {!member.hasHeadshot && (
                <button
                  id={`upload-headshot-${member.id}`}
                  onClick={(e) => { e.stopPropagation(); setUploadModal(member) }}
                  className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#5B4EFF] hover:opacity-70"
                >
                  <Upload size={10} />
                  Add Headshot
                </button>
              )}
            </button>
          )
        })}
      </div>

      {/* Headshot upload modal */}
      {uploadModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setUploadModal(null)} />
          <div
            id="headshot-modal"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-modal shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111118]">Upload Headshot — {uploadModal.name}</h3>
              <button onClick={() => setUploadModal(null)} className="text-[#9999AA] hover:text-[#555566]">
                <X size={16} />
              </button>
            </div>
            <div className="border-2 border-dashed border-[#E5E5EF] rounded-card p-8 text-center mb-4">
              <Camera size={24} className="mx-auto text-[#9999AA] mb-2" />
              <p className="text-sm text-[#555566] mb-1">JPEG or PNG, min 512×512px</p>
              <p className="text-[11px] text-[#9999AA]">Face must be clearly visible</p>
              <button
                id="upload-headshot-file-btn"
                className="mt-4 px-4 py-2 bg-[#5B4EFF] text-white text-xs font-semibold rounded-btn hover:opacity-90"
                onClick={() => {
                  toast('Headshot uploaded — running quality check…', 'info')
                  setUploadModal(null)
                }}
              >
                Choose File
              </button>
            </div>
            <p className="text-[10px] text-[#9999AA] text-center">
              We never store biometric data. Headshots are used solely for AI avatar synthesis.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
