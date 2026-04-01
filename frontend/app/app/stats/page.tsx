'use client'

import { useState, useEffect } from 'react'
import { BarChart2, Flame, Trophy, Target, Zap } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const ACCURACY_DATA = [
  { date: 'Mar 10', score: 60 }, { date: 'Mar 15', score: 73 },
  { date: 'Mar 20', score: 68 }, { date: 'Mar 25', score: 81 },
  { date: 'Mar 30', score: 79 }, { date: 'Apr 1', score: 88 },
]

// ── Circular Gauge SVG ────────────────────────────────────────────────────────
function CircularGauge({ value, label }: { value: number; label: string }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(value), 200)
    return () => clearTimeout(timeout)
  }, [value])

  const offset = circ * (1 - animatedValue / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          {/* Track */}
          <circle cx="56" cy="56" r={r} fill="none" stroke="#1A1A24" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="56" cy="56" r={r}
            fill="none"
            stroke="#E8FF47"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-[#E8FF47]">{Math.round(animatedValue)}%</span>
          <span className="text-[9px] text-[#44445A] font-semibold uppercase tracking-wider">of co.</span>
        </div>
      </div>
      <p className="text-xs text-[#8888A0] text-center">{label}</p>
    </div>
  )
}

// ── Stats Page ────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const streak = 7

  useEffect(() => {
    sessionStorage.setItem('bw-streak-shown', '1')
  }, [])

  return (
    <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={16} className="text-[#E8FF47]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E8FF47]">My Stats</span>
        </div>
        <h1 className="text-4xl font-display text-[#F0F0F8]">YOUR PERFORMANCE</h1>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Quiz Accuracy', value: '88%', icon: Target, color: 'text-[#47FF9E]' },
          { label: 'Modules Done', value: '6 / 9', icon: Trophy, color: 'text-[#E8FF47]' },
          { label: 'Avg Speed', value: '4.2s', icon: Zap, color: 'text-[#FFB347]' },
          { label: 'Day Streak', value: `${streak} 🔥`, icon: Flame, color: 'text-[#FF4747]' },
        ].map((s) => (
          <div key={s.label} className="bg-[#111118] rounded-card border border-white/5 p-4">
            <s.icon size={16} className={`${s.color} mb-2`} />
            <p className="text-[10px] text-[#8888A0] uppercase tracking-wider font-semibold">{s.label}</p>
            <p className="text-xl font-bold text-[#F0F0F8] mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quiz accuracy line chart */}
      <div className="bg-[#111118] rounded-card border border-white/5 p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#F0F0F8] mb-6">Quiz Accuracy History</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ACCURACY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#44445A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#44445A' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v}%`, 'Accuracy']}
              labelStyle={{ color: '#8888A0' }}
            />
            <Line type="monotone" dataKey="score" stroke="#E8FF47" strokeWidth={2} dot={{ r: 3, fill: '#E8FF47' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Speed & Reflexes + Curriculum progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Speed gauge */}
        <div className="bg-[#111118] rounded-card border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-[#F0F0F8] mb-1">Speed & Reflexes</h2>
          <p className="text-[11px] text-[#44445A] mb-6">Your response speed vs. company average</p>
          <div className="flex items-center justify-center gap-8">
            <CircularGauge value={88} label="Faster than 88% of colleagues" />
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-[#44445A] uppercase tracking-wider">Your avg</p>
                <p className="text-lg font-bold text-[#E8FF47]">4.2s</p>
              </div>
              <div>
                <p className="text-[10px] text-[#44445A] uppercase tracking-wider">Company avg</p>
                <p className="text-lg font-bold text-[#8888A0]">6.8s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum progress */}
        <div className="bg-[#111118] rounded-card border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-[#F0F0F8] mb-1">Curriculum Progress</h2>
          <p className="text-[11px] text-[#44445A] mb-6">Your assigned training completion</p>

          <div className="space-y-4">
            {[
              { title: 'Data Security Essentials', pct: 80 },
              { title: 'Legal & Compliance', pct: 100 },
              { title: 'HR Policies 2025', pct: 33 },
              { title: 'Software Engineering Practices', pct: 60 },
            ].map((module) => (
              <div key={module.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-[#8888A0] truncate">{module.title}</p>
                  <span className={`text-[10px] font-bold ${module.pct === 100 ? 'text-[#47FF9E]' : 'text-[#E8FF47]'}`}>
                    {module.pct}%
                  </span>
                </div>
                <div className="h-1 bg-[#1A1A24] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${module.pct === 100 ? 'bg-[#47FF9E]' : 'bg-[#E8FF47]'}`}
                    style={{ width: `${module.pct}%`, transition: 'width 1s ease-out' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Overall */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-[#44445A]">Overall completion</p>
            <p className="text-lg font-bold text-[#E8FF47]">67%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
