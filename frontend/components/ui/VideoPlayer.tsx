'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Settings,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react'

interface QuizQuestion {
  id: string
  timestamp_s: number
  question_text: string
  options: string[]
  correct_index: number
  time_limit_s: number
}

// Demo questions (replaced by DB fetch in production)
const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    timestamp_s: 12,
    question_text: 'What should you do if you receive a suspicious email asking for your credentials?',
    options: [
      'Click the link to verify if it\'s legitimate',
      'Forward it to your IT department and delete it',
      'Reply asking the sender to confirm their identity',
      'Ignore it and hope it goes away',
    ],
    correct_index: 1,
    time_limit_s: 15,
  },
  {
    id: 'q2',
    timestamp_s: 24,
    question_text: 'How often should you change your password for critical systems?',
    options: [
      'Only when you forget it',
      'Every week',
      'Every 3 months or when compromised',
      'Never — strong passwords don\'t need changing',
    ],
    correct_index: 2,
    time_limit_s: 15,
  },
]

// ── Quiz Overlay ──────────────────────────────────────────────────────────────
interface QuizOverlayProps {
  question: QuizQuestion
  onComplete: (correct: boolean, responseTime: number) => void
}

function QuizOverlay({ question, onComplete }: QuizOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(question.time_limit_s)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [shake, setShake] = useState(false)
  const startTime = useRef(Date.now())
  const isLocked = feedback !== null

  // Countdown timer
  useEffect(() => {
    if (isLocked) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          handleAnswer(null) // Timeout
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isLocked])

  function handleAnswer(idx: number | null) {
    if (isLocked) return
    const responseTime = Date.now() - startTime.current
    const isCorrect = idx === question.correct_index
    setSelected(idx)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    if (!isCorrect) setShake(true)

    setTimeout(() => {
      onComplete(isCorrect, responseTime)
    }, isCorrect ? 1500 : 3000)
  }

  const pct = (timeLeft / question.time_limit_s) * 100
  const timerColor = pct > 50 ? '#47FF9E' : pct > 20 ? '#FFB347' : '#FF4747'
  const timerBg = pct > 50 ? 'rgba(71,255,158,0.15)' : pct > 20 ? 'rgba(255,179,71,0.15)' : 'rgba(255,71,71,0.15)'

  // Accessibility: announce timer at 10s and 5s
  const [announced, setAnnounced] = useState('')
  useEffect(() => {
    if (timeLeft === 10) setAnnounced('10 seconds remaining')
    if (timeLeft === 5) setAnnounced('5 seconds remaining')
  }, [timeLeft])

  return (
    <div
      id="quiz-overlay"
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{
        backdropFilter: 'blur(8px) brightness(0.4)',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <div
        className={`relative w-full max-w-lg mx-4 bg-[#111118] rounded-modal border-2 overflow-hidden ${
          feedback === 'correct' ? 'border-[#47FF9E]' : feedback === 'incorrect' ? 'border-[#FF4747]' : 'border-white/10'
        } transition-all duration-300`}
        style={{
          animation: shake ? 'quizShake 0.5s ease-out' : 'quizScale 200ms ease-out-back',
        }}
        onAnimationEnd={() => setShake(false)}
      >
        {/* Timer bar — top edge */}
        <div className="h-1.5 bg-[#1A1A24] relative">
          <div
            className="h-full transition-all duration-1000 linear"
            style={{
              width: `${pct}%`,
              backgroundColor: timerColor,
              boxShadow: `0 0 8px ${timerBg}`,
            }}
          />
        </div>

        <div className="p-6">
          {/* Timer + heading */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8888A0]">
              Action Check
            </span>
            <div className="flex items-center gap-1.5" style={{ color: timerColor }}>
              <Clock size={12} />
              <span className="font-mono text-sm font-bold">{timeLeft}s</span>
            </div>
          </div>

          {/* Question */}
          <p className="text-[#F0F0F8] text-base font-semibold text-center leading-snug mb-6">
            {question.question_text}
          </p>

          {/* Options grid 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.correct_index
              const showCorrect = feedback !== null && isCorrect
              const showWrong = feedback !== null && isSelected && !isCorrect

              return (
                <button
                  key={i}
                  id={`quiz-option-${i}`}
                  onClick={() => handleAnswer(i)}
                  disabled={isLocked}
                  className={`px-4 py-3 rounded-pill text-sm font-medium text-left transition-all duration-200 border ${
                    showCorrect
                      ? 'bg-[#47FF9E]/15 border-[#47FF9E] text-[#47FF9E]'
                      : showWrong
                      ? 'bg-[#FF4747]/15 border-[#FF4747] text-[#FF4747]'
                      : isSelected && !feedback
                      ? 'bg-[#E8FF47]/10 border-[#E8FF47]/60 text-[#F0F0F8]'
                      : 'bg-[#1A1A24] border-white/10 text-[#8888A0] hover:border-[#E8FF47]/40 hover:text-[#F0F0F8] hover:bg-[#E8FF47]/5'
                  } disabled:cursor-not-allowed`}
                >
                  <span className="flex items-center gap-2">
                    {showCorrect && <CheckCircle size={13} className="text-[#47FF9E] flex-shrink-0" />}
                    {showWrong && <XCircle size={13} className="text-[#FF4747] flex-shrink-0" />}
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-4 flex items-center gap-2 text-xs font-semibold ${
              feedback === 'correct' ? 'text-[#47FF9E]' : 'text-[#FF4747]'
            }`}>
              {feedback === 'correct' ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {feedback === 'correct' ? 'Correct! Resuming…' : 'Incorrect — see the correct answer above. Resuming in 3s…'}
            </div>
          )}
        </div>
      </div>

      {/* ARIA live region for timer */}
      <div aria-live="assertive" className="sr-only">{announced}</div>

      <style jsx global>{`
        @keyframes quizScale {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes quizShake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-4px); }
          90%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}

// ── Custom Video Player Shell ─────────────────────────────────────────────────
interface VideoPlayerProps {
  src?: string
  questions?: QuizQuestion[]
  episodeId: string
}

export default function VideoPlayer({ src, questions = DEMO_QUESTIONS, episodeId: _episodeId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const fullscreenRef = useRef(false)
  const [furthestWatched, setFurthestWatched] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set())
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>()

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0
  const watchedPct = duration > 0 ? (furthestWatched / duration) * 100 : 0

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    setShowControls(true)
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  useEffect(() => {
    scheduleHideControls()
    return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current) }
  }, [scheduleHideControls])

  // Time update + quiz trigger
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    const t = v.currentTime
    setCurrentTime(t)
    setFurthestWatched((fw) => Math.max(fw, t))

    // Check quiz triggers
    for (const q of questions) {
      if (!answeredQuestions.has(q.id) && t >= q.timestamp_s && t < q.timestamp_s + 0.5) {
        v.pause()
        setPlaying(false)
        setActiveQuestion(q)
        break
      }
    }
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
    scheduleHideControls()
  }

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const targetPct = x / rect.width
    const targetTime = targetPct * duration

    // Watch-gating: can't scrub past furthest watched
    if (targetTime > furthestWatched + 1) {
      // Snap back with shake
      bar.style.animation = 'scrubShake 0.3s ease-out'
      setTimeout(() => { bar.style.animation = '' }, 300)
      return
    }

    if (videoRef.current) {
      videoRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  const handleQuizComplete = async (correct: boolean, responseTime: number) => {
    if (!activeQuestion) return
    setAnsweredQuestions((prev) => new Set(Array.from(prev).concat(activeQuestion.id)))
    setActiveQuestion(null)

    // Resume video
    if (videoRef.current) {
      videoRef.current.play()
      setPlaying(true)
    }

    // Log to DB (best-effort)
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('quiz_attempts').insert({
          question_id: activeQuestion.id,
          employee_id: user.id,
          correct,
          response_time_ms: responseTime,
        })
      }
    } catch { /* offline — will sync later */ }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      fullscreenRef.current = true
    } else {
      document.exitFullscreen()
      fullscreenRef.current = false
    }
  }

  return (
    <div
      ref={containerRef}
      id="video-player-container"
      className="relative bg-black aspect-video w-full rounded-card overflow-hidden group cursor-none"
      onMouseMove={scheduleHideControls}
      onClick={handlePlayPause}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 30)}
        onEnded={() => setPlaying(false)}
        muted={muted}
      />

      {/* No video — placeholder */}
      {!src && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111118]">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E8FF47]/20 to-[#5B4EFF]/20 flex items-center justify-center mb-4">
            <Play size={32} fill="#E8FF47" className="text-[#E8FF47] ml-1" />
          </div>
          <p className="text-[#8888A0] text-sm">Demo player — connect a video URL</p>
          <p className="text-[#44445A] text-xs mt-2">Quiz overlays will demo at 12s and 24s</p>
        </div>
      )}

      {/* Quiz overlay */}
      {activeQuestion && (
        <QuizOverlay question={activeQuestion} onComplete={handleQuizComplete} />
      )}

      {/* ── Controls bar ──────────────────────────────────────────── */}
      <div
        id="player-controls"
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{ opacity: showControls && !activeQuestion ? 1 : 0, pointerEvents: showControls && !activeQuestion ? 'auto' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frosted glass bar */}
        <div className="bg-gradient-to-t from-[#0A0A0F]/90 to-transparent pt-12 pb-4 px-4">
          {/* Scrub bar */}
          <div
            id="scrub-bar"
            className="relative h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/scrub hover:h-1.5 transition-all"
            onMouseDown={handleScrub}
          >
            {/* Watched range */}
            <div className="absolute left-0 top-0 h-full bg-white/30 rounded-full" style={{ width: `${watchedPct}%` }} />
            {/* Played range */}
            <div className="absolute left-0 top-0 h-full bg-[#E8FF47] rounded-full" style={{ width: `${pct}%` }} />
            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E8FF47] shadow-md opacity-0 group-hover/scrub:opacity-100 transition-opacity"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            {/* Play/pause */}
            <button
              id="player-play-pause"
              onClick={handlePlayPause}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              {playing
                ? <Pause size={16} fill="#F0F0F8" className="text-[#F0F0F8]" />
                : <Play  size={16} fill="#F0F0F8" className="text-[#F0F0F8] ml-0.5" />
              }
            </button>

            {/* Time */}
            <span className="text-[#F0F0F8] text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button
                id="player-mute"
                onClick={() => setMuted(!muted)}
                className="text-[#F0F0F8] hover:text-[#E8FF47] transition-colors"
              >
                {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input
                id="player-volume"
                type="range" min="0" max="1" step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  if (videoRef.current) videoRef.current.volume = v
                  setMuted(v === 0)
                }}
                className="w-16 accent-[#E8FF47] opacity-0 group-hover/vol:opacity-100 transition-opacity"
              />
            </div>

            {/* Settings, Fullscreen */}
            <button id="player-settings" className="text-[#8888A0] hover:text-[#F0F0F8] transition-colors">
              <Settings size={14} />
            </button>
            <button
              id="player-fullscreen"
              onClick={toggleFullscreen}
              className="text-[#8888A0] hover:text-[#F0F0F8] transition-colors"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo: watch-gate indicator */}
      {watchedPct < 100 && !activeQuestion && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-[#0A0A0F]/70 rounded-pill">
          <AlertCircle size={11} className="text-[#FFB347]" />
          <span className="text-[9px] text-[#FFB347] font-semibold">Scrub-gated</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes scrubShake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
