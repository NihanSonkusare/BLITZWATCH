'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Film, AlertCircle, X } from 'lucide-react'
import GenerationTracker from '@/components/ui/GenerationTracker'
import { createClient } from '@/lib/supabase'
import { toast } from '@/components/ui/Toast'

interface ActiveJob {
  moduleId: string
  title: string
  script?: string
}

export default function StudioPage() {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([])
  const [rejectedFile, setRejectedFile] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
    setRejectedFile(null)
    setUploadError(null)

    if ((rejectedFiles as Array<{ errors: Array<{ code: string }> }>).length > 0) {
      const err = (rejectedFiles as Array<{ errors: Array<{ code: string }> }>)[0].errors[0]
      if (err.code === 'file-too-large') setRejectedFile('File is too large. Maximum size is 50 MB.')
      else setRejectedFile('Invalid file type. Please upload a PDF or DOCX.')
      return
    }

    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress (real progress requires XHR not fetch)
      const interval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + Math.random() * 15, 90))
      }, 300)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const storagePath = `documents/${user.id}/${Date.now()}.${fileExt}`

      const { error: storageError } = await supabase.storage
        .from('training-documents')
        .upload(storagePath, file)

      clearInterval(interval)
      setUploadProgress(100)

      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage
        .from('training-documents')
        .getPublicUrl(storagePath)

      // Create training module record
      const title = file.name.replace(/\.[^.]+$/, '')
      const { data: module, error: moduleError } = await supabase
        .from('training_modules')
        .insert({
          title,
          source_file_url: publicUrl,
          status: 'queued',
          created_by_hr_id: user.id,
        })
        .select()
        .single()

      if (moduleError) throw moduleError

      // Trigger backend pipeline via API
      try {
        await fetch('/api/pipeline/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId: module.id, fileUrl: publicUrl }),
        })
      } catch {
        // Backend may not be running in dev — continue with UI
      }

      setActiveJobs((prev) => [...prev, { moduleId: module.id, title }])
      toast('Upload complete — pipeline started!', 'success')
    } catch (err) {
      console.error(err)
      setUploadError('Upload failed. Please try again.')
      toast('Upload failed. Please try again.', 'error')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }, [supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Film size={18} className="text-[#5B4EFF]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#5B4EFF]">Content Studio</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111118]">Create New Episode</h1>
        <p className="text-[#555566] text-sm mt-1">Upload a training document to generate an AI-powered episode.</p>
      </div>

      {/* ── Upload Dropzone ──────────────────────────────────────────── */}
      <div
        id="upload-dropzone"
        {...getRootProps()}
        className={`relative rounded-card border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 mb-4 ${
          isDragActive
            ? 'border-[#5B4EFF] bg-[#5B4EFF]/5'
            : uploading
            ? 'border-[#E5E5EF] bg-[#F8F8FB] cursor-not-allowed'
            : 'border-[#E5E5EF] bg-white hover:border-[#5B4EFF]/60 hover:bg-[#5B4EFF]/3'
        }`}
      >
        <input {...getInputProps()} id="file-input" />

        {uploading ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-[#5B4EFF]/10 flex items-center justify-center mx-auto mb-4">
              <div className="w-5 h-5 border-2 border-[#5B4EFF]/30 border-t-[#5B4EFF] rounded-full animate-spin" />
            </div>
            <p className="text-sm font-semibold text-[#111118] mb-3">Uploading…</p>
            <div className="w-48 mx-auto bg-[#E5E5EF] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#5B4EFF] transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[#9999AA] text-xs mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        ) : (
          <div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
              isDragActive ? 'bg-[#5B4EFF]' : 'bg-[#F0F0F8]'
            }`}>
              <Upload size={20} className={isDragActive ? 'text-white' : 'text-[#9999AA]'} />
            </div>
            <p className="text-sm font-semibold text-[#111118] mb-1">
              {isDragActive ? 'Drop it!' : 'Drop your training PDF or DOCX here'}
            </p>
            <p className="text-[#9999AA] text-xs mb-4">Max 50 MB · PDF and DOCX accepted</p>
            <button
              id="browse-files-btn"
              type="button"
              className="px-4 py-2 bg-[#5B4EFF] text-white text-xs font-semibold rounded-btn hover:opacity-90 transition-opacity"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {/* Rejected file error */}
      {rejectedFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-btn mb-4 text-xs text-[#EF4444]">
          <AlertCircle size={13} />
          <span>{rejectedFile}</span>
          <button onClick={() => setRejectedFile(null)} className="ml-auto"><X size={12} /></button>
        </div>
      )}

      {/* Active pipeline jobs */}
      {activeJobs.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-sm font-semibold text-[#111118]">Active Pipelines</h2>
          {activeJobs.map((job) => (
            <div key={job.moduleId}>
              <p className="text-xs text-[#555566] mb-2 font-medium">{job.title}</p>
              <GenerationTracker
                moduleId={job.moduleId}
                script={job.script}
                onApprove={async () => {
                  // Update DB to trigger video generation
                  await supabase
                    .from('training_modules')
                    .update({ status: 'generating_video' })
                    .eq('id', job.moduleId)
                  toast('Script approved — generating video!', 'success')
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Recent modules */}
      <RecentModules />
    </div>
  )
}

function RecentModules() {
  const supabase = createClient()
  const [modules, setModules] = useState<Array<{
    id: string; title: string; status: string; created_at: string
  }>>([])

  useState(() => {
    supabase
      .from('training_modules')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setModules(data) })
  })

  const STATUS_COLOR: Record<string, string> = {
    published:    'text-[#22C55E] bg-[#22C55E]/10',
    failed:       'text-[#EF4444] bg-[#EF4444]/10',
    queued:       'text-[#9999AA] bg-[#E5E5EF]',
    extracting:   'text-[#5B4EFF] bg-[#5B4EFF]/10',
    scripting:    'text-[#5B4EFF] bg-[#5B4EFF]/10',
    awaiting_approval: 'text-[#F59E0B] bg-[#F59E0B]/10',
    generating_video:  'text-[#5B4EFF] bg-[#5B4EFF]/10',
    publishing:    'text-[#5B4EFF] bg-[#5B4EFF]/10',
  }

  if (modules.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-[#111118] mb-3">Recent Modules</h2>
      <div className="bg-white rounded-card border border-[#E5E5EF] overflow-hidden">
        {modules.map((m, i) => (
          <div
            key={m.id}
            className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[#E5E5EF]' : ''}`}
          >
            <div className="w-8 h-8 rounded-btn bg-[#F8F8FB] flex items-center justify-center flex-shrink-0">
              <Film size={14} className="text-[#9999AA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111118] truncate">{m.title}</p>
              <p className="text-[10px] text-[#9999AA]">{new Date(m.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill ${STATUS_COLOR[m.status] ?? 'text-[#9999AA] bg-[#E5E5EF]'}`}>
              {m.status.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
