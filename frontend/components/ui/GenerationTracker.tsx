'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Loader2, XCircle, Clock, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase'

type PipelineStatus = 'queued' | 'extracting' | 'scripting' | 'awaiting_approval' | 'generating_video' | 'publishing' | 'published' | 'failed'

const STEPS: { key: PipelineStatus; label: string }[] = [
  { key: 'queued',            label: 'Queued' },
  { key: 'extracting',        label: 'Extracting Text' },
  { key: 'scripting',         label: 'Writing Script' },
  { key: 'awaiting_approval', label: 'Awaiting Approval' },
  { key: 'generating_video',  label: 'Generating Video' },
  { key: 'publishing',        label: 'Publishing' },
  { key: 'published',         label: 'Published ✓' },
]

const STATUS_ORDER: PipelineStatus[] = [
  'queued','extracting','scripting','awaiting_approval','generating_video','publishing','published'
]

interface Props {
  moduleId: string
  onApprove?: () => void
  script?: string | null
}

export default function GenerationTracker({ moduleId, onApprove, script }: Props) {
  const supabase = createClient()
  const [status, setStatus] = useState<PipelineStatus>('queued')
  const [error, setError] = useState<string | null>(null)
  const [showScript, setShowScript] = useState(false)

  useEffect(() => {
    // Initial fetch
    const fetchStatus = async () => {
      // Bypass stale generated types — error_message column was added in migration
      // eslint-disable-next-line
      const { data } = await (supabase as any)
        .from('training_modules')
        .select('status, error_message')
        .eq('id', moduleId)
        .single()
      if (data) {
        setStatus(data.status as PipelineStatus)
        setError(data.error_message ?? null)
      }
    }
    fetchStatus()

    // Real-time subscription
    const channel = supabase
      .channel(`module:${moduleId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'training_modules', filter: `id=eq.${moduleId}` },
        (payload) => {
          const newStatus = payload.new.status as PipelineStatus
          setStatus(newStatus)
          setError(payload.new.error_message)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [moduleId, supabase])

  const currentIdx = STATUS_ORDER.indexOf(status)

  return (
    <div id={`tracker-${moduleId}`} className="bg-white rounded-card border border-[#E5E5EF] p-6">
      <h3 className="text-sm font-semibold text-[#111118] mb-6">Generation Pipeline</h3>

      {/* Step nodes */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const stepIdx = STATUS_ORDER.indexOf(step.key)
          const isDone = currentIdx > stepIdx || status === 'published'
          const isActive = currentIdx === stepIdx && status !== 'failed' && status !== 'published'
          const isFailed = status === 'failed' && isActive

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isFailed
                    ? 'bg-[#EF4444] border-[#EF4444]'
                    : isDone
                    ? 'bg-[#22C55E] border-[#22C55E]'
                    : isActive
                    ? 'border-[#5B4EFF] bg-[#5B4EFF]/10 animate-pulse'
                    : 'border-[#E5E5EF] bg-[#F8F8FB]'
                }`}>
                  {isFailed ? (
                    <XCircle size={16} className="text-white" />
                  ) : isDone ? (
                    <CheckCircle size={16} className="text-white" />
                  ) : isActive ? (
                    <Loader2 size={14} className="text-[#5B4EFF] animate-spin" />
                  ) : (
                    <Clock size={12} className="text-[#E5E5EF]" />
                  )}
                </div>
                <span className={`text-[10px] font-medium text-center whitespace-nowrap ${
                  isDone ? 'text-[#22C55E]' : isActive ? 'text-[#5B4EFF]' : 'text-[#9999AA]'
                }`}>
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${
                  isDone ? 'bg-[#22C55E]' : 'bg-[#E5E5EF]'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Error state */}
      {status === 'failed' && error && (
        <div className="mt-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-btn flex items-start gap-2">
          <XCircle size={14} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-[#EF4444]">{error}</p>
          </div>
          <button
            id="retry-pipeline-btn"
            className="flex items-center gap-1 text-xs text-[#EF4444] font-semibold hover:opacity-70 transition-opacity"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Script preview gate */}
      {status === 'awaiting_approval' && script && (
        <div className="mt-4 border border-[#5B4EFF]/20 rounded-btn overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#5B4EFF]/5">
            <span className="text-xs font-semibold text-[#5B4EFF]">Script Preview — Review before generating video</span>
            <button
              id="toggle-script-preview"
              onClick={() => setShowScript(!showScript)}
              className="text-xs text-[#5B4EFF] hover:opacity-70"
            >
              {showScript ? 'Hide' : 'Show Script'}
            </button>
          </div>
          {showScript && (
            <div className="px-4 py-3 bg-white">
              <p className="text-sm text-[#111118] leading-relaxed whitespace-pre-wrap font-mono text-xs">{script}</p>
            </div>
          )}
          <div className="px-4 py-3 bg-[#F8F8FB] border-t border-[#E5E5EF] flex gap-3">
            <button
              id="approve-script-btn"
              onClick={onApprove}
              className="px-4 py-2 bg-[#5B4EFF] text-white text-xs font-semibold rounded-btn hover:opacity-90 transition-opacity"
            >
              ✓ Approve & Generate Video
            </button>
            <button
              id="reject-script-btn"
              className="px-4 py-2 bg-transparent border border-[#E5E5EF] text-[#555566] text-xs font-semibold rounded-btn hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
            >
              Reject & Re-generate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
