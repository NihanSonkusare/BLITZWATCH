'use client'

import { useState } from 'react'
import { TrendingUp, Download, Users, X, Clock, Target, Zap } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// Demo data (replaced by real Supabase queries in production)
const COMPLETION_DATA_30 = [
  { date: 'Mar 1', rate: 45 }, { date: 'Mar 5', rate: 52 }, { date: 'Mar 10', rate: 48 },
  { date: 'Mar 15', rate: 63 }, { date: 'Mar 20', rate: 71 }, { date: 'Mar 25', rate: 68 },
  { date: 'Mar 30', rate: 78 }, { date: 'Apr 1', rate: 82 },
]

const DEPT_DATA = [
  { dept: 'Engineering', score: 88, employees: 24 },
  { dept: 'Sales', score: 71, employees: 18 },
  { dept: 'HR', score: 94, employees: 8 },
  { dept: 'Finance', score: 65, employees: 12 },
  { dept: 'Marketing', score: 79, employees: 15 },
  { dept: 'Operations', score: 83, employees: 20 },
]

interface Employee {
  id: string; name: string; email: string;
  watchTime: number; accuracy: number; avgResponse: number
}

const DEMO_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@co.com', watchTime: 142, accuracy: 91, avgResponse: 4200 },
  { id: '2', name: 'Sarah Kim', email: 'sarah@co.com', watchTime: 98, accuracy: 84, avgResponse: 5800 },
  { id: '3', name: 'James Rowe', email: 'james@co.com', watchTime: 67, accuracy: 73, avgResponse: 7100 },
]

export default function AnalyticsPage() {
  const [window_, setWindow] = useState<'30' | '60' | '90'>('30')
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [drawerEmployee, setDrawerEmployee] = useState<Employee | null>(null)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-[#5B4EFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#5B4EFF]">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111118]">Performance Dashboard</h1>
        </div>
        <button
          id="export-csv-btn"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5EF] rounded-btn text-sm font-medium text-[#555566] hover:border-[#5B4EFF]/40 hover:text-[#5B4EFF] transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Completion Rate', value: '82%', delta: '+7%', positive: true },
          { label: 'Avg Quiz Score', value: '79/100', delta: '+4pts', positive: true },
          { label: 'Active Employees', value: '97', delta: '5 new', positive: true },
          { label: 'Pipeline Success', value: '96%', delta: '-1%', positive: false },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-card border border-[#E5E5EF] p-4">
            <p className="text-[11px] text-[#9999AA] font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-[#111118]">{stat.value}</p>
            <span className={`text-[11px] font-semibold ${stat.positive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {stat.delta} this month
            </span>
          </div>
        ))}
      </div>

      {/* Completion line chart */}
      <div className="bg-white rounded-card border border-[#E5E5EF] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#111118]">Company-Wide Completion Rate</h2>
          <div className="flex rounded-btn overflow-hidden border border-[#E5E5EF] text-xs">
            {(['30', '60', '90'] as const).map((w) => (
              <button
                key={w}
                id={`window-btn-${w}`}
                onClick={() => setWindow(w)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  window_ === w ? 'bg-[#5B4EFF] text-white' : 'text-[#555566] hover:bg-[#F8F8FB]'
                }`}
              >
                {w}D
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={COMPLETION_DATA_30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F8" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9999AA' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9999AA' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E5E5EF', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, 'Completion']}
            />
            <Line type="monotone" dataKey="rate" stroke="#5B4EFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department bar chart */}
      <div className="bg-white rounded-card border border-[#E5E5EF] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111118] mb-1">Quiz Scores by Department</h2>
        <p className="text-[11px] text-[#9999AA] mb-6">Click a bar to drill down into employees</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DEPT_DATA} onClick={(d) => d && setSelectedDept(d.activePayload?.[0]?.payload.dept ?? null)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F8" vertical={false} />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#9999AA' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9999AA' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E5E5EF', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, 'Avg Score']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} cursor="pointer">
              {DEPT_DATA.map((entry) => (
                <Cell
                  key={entry.dept}
                  fill={selectedDept === entry.dept ? '#5B4EFF' : '#E8FF47'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Employee list drill-down */}
        {selectedDept && (
          <div className="mt-6 border-t border-[#E5E5EF] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#111118] flex items-center gap-2">
                <Users size={14} />
                {selectedDept} — Employees
              </h3>
              <button onClick={() => setSelectedDept(null)} className="text-[#9999AA] hover:text-[#555566]">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {DEMO_EMPLOYEES.map((emp) => (
                <button
                  key={emp.id}
                  id={`employee-row-${emp.id}`}
                  onClick={() => setDrawerEmployee(emp)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-[#F8F8FB] transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5B4EFF]/10 flex items-center justify-center text-xs font-bold text-[#5B4EFF]">
                    {emp.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#111118]">{emp.name}</p>
                    <p className="text-[11px] text-[#9999AA]">{emp.email}</p>
                  </div>
                  <span className="text-sm font-bold text-[#5B4EFF]">{emp.accuracy}%</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Employee drilldown side drawer */}
      {drawerEmployee && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDrawerEmployee(null)} />
          <div
            id="employee-drawer"
            className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-[#E5E5EF] z-50 shadow-xl flex flex-col"
            style={{ animation: 'slideInRight 350ms ease-out' }}
          >
            <div className="flex items-center gap-3 p-5 border-b border-[#E5E5EF]">
              <div className="w-10 h-10 rounded-full bg-[#5B4EFF]/10 flex items-center justify-center text-sm font-bold text-[#5B4EFF]">
                {drawerEmployee.name[0]}
              </div>
              <div>
                <p className="font-semibold text-[#111118]">{drawerEmployee.name}</p>
                <p className="text-xs text-[#9999AA]">{drawerEmployee.email}</p>
              </div>
              <button
                id="close-drawer-btn"
                onClick={() => setDrawerEmployee(null)}
                className="ml-auto p-1.5 rounded-btn hover:bg-[#F8F8FB] text-[#9999AA]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              {[
                { label: 'Total Watch Time', value: `${drawerEmployee.watchTime} min`, icon: Clock, color: 'text-[#5B4EFF]' },
                { label: 'Quiz Accuracy', value: `${drawerEmployee.accuracy}%`, icon: Target, color: 'text-[#22C55E]' },
                { label: 'Avg Response Speed', value: `${(drawerEmployee.avgResponse / 1000).toFixed(1)}s`, icon: Zap, color: 'text-[#F59E0B]' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 bg-[#F8F8FB] rounded-btn">
                  <stat.icon size={16} className={stat.color} />
                  <div>
                    <p className="text-[11px] text-[#9999AA] font-medium">{stat.label}</p>
                    <p className="text-sm font-bold text-[#111118]">{stat.value}</p>
                  </div>
                </div>
              ))}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9999AA] mb-3">Module Breakdown</p>
                {['Data Security 101', 'Onboarding Essentials', 'GDPR Compliance'].map((mod) => (
                  <div key={mod} className="flex items-center gap-3 py-2 border-b border-[#E5E5EF] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
                    <p className="text-xs text-[#555566] flex-1">{mod}</p>
                    <span className="text-[10px] font-semibold text-[#22C55E]">Complete</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
