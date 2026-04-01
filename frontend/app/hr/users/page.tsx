'use client'

import { useState } from 'react'
import { Settings, UserPlus, Mail, Shield, MoreHorizontal, X } from 'lucide-react'
import { toast } from '@/components/ui/Toast'

interface User {
  id: string; name: string; email: string; role: 'hr' | 'employee'; department: string; status: 'active' | 'inactive'
}

const DEMO_USERS: User[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@company.com', role: 'employee', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Sarah Kim', email: 'sarah@company.com', role: 'employee', department: 'Sales', status: 'active' },
  { id: '3', name: 'Jordan Taylor', email: 'jordan@company.com', role: 'hr', department: 'HR', status: 'active' },
  { id: '4', name: 'Sam Rivera', email: 'sam@company.com', role: 'employee', department: 'Finance', status: 'inactive' },
  { id: '5', name: 'Emma Lewis', email: 'emma@company.com', role: 'employee', department: 'Marketing', status: 'active' },
]

export default function UsersPage() {
  const users = DEMO_USERS
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'hr' | 'employee'>('employee')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={18} className="text-[#5B4EFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#5B4EFF]">User Management</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111118]">Team Members</h1>
        </div>
        <button
          id="invite-user-btn"
          onClick={() => setInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#5B4EFF] text-white text-sm font-semibold rounded-btn hover:opacity-90 transition-opacity"
        >
          <UserPlus size={15} />
          Invite Member
        </button>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-card border border-[#E5E5EF] overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-[#E5E5EF] bg-[#F8F8FB]">
          {['Name', 'Role', 'Department', 'Status', ''].map((h, i) => (
            <div key={i} className={`text-[10px] font-bold uppercase tracking-wider text-[#9999AA] ${
              i === 0 ? 'col-span-4' : i === 4 ? 'col-span-1' : 'col-span-2'
            }`}>{h}</div>
          ))}
        </div>

        {users.map((user, i) => (
          <div key={user.id} className={`grid grid-cols-12 px-5 py-3 items-center ${i > 0 ? 'border-t border-[#E5E5EF]' : ''} hover:bg-[#F8F8FB] transition-colors`}>
            {/* Name + email */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5B4EFF]/10 flex items-center justify-center text-[#5B4EFF] text-xs font-bold">
                {user.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-[#111118]">{user.name}</p>
                <p className="text-[10px] text-[#9999AA]">{user.email}</p>
              </div>
            </div>
            {/* Role */}
            <div className="col-span-2">
              <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-pill text-[10px] font-bold ${
                user.role === 'hr' ? 'bg-[#5B4EFF]/10 text-[#5B4EFF]' : 'bg-[#E5E5EF] text-[#555566]'
              }`}>
                {user.role === 'hr' ? <Shield size={10} /> : null}
                {user.role.toUpperCase()}
              </span>
            </div>
            {/* Department */}
            <div className="col-span-2">
              <span className="text-sm text-[#555566]">{user.department}</span>
            </div>
            {/* Status */}
            <div className="col-span-2">
              <span className={`flex items-center gap-1.5 text-[10px] font-semibold ${
                user.status === 'active' ? 'text-[#22C55E]' : 'text-[#9999AA]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#22C55E]' : 'bg-[#9999AA]'}`} />
                {user.status}
              </span>
            </div>
            {/* Actions */}
            <div className="col-span-1 flex justify-end">
              <button
                id={`user-actions-${user.id}`}
                className="p-1 rounded-btn text-[#9999AA] hover:text-[#555566] hover:bg-[#F0F0F8] transition-colors"
              >
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      {inviteModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setInviteModal(false)} />
          <div id="invite-modal" className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-modal shadow-2xl z-50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#111118]">Invite Team Member</h3>
              <button onClick={() => setInviteModal(false)} className="text-[#9999AA] hover:text-[#555566]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9999AA] mb-1.5">Email</label>
                <input
                  id="invite-email-input"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2.5 border border-[#E5E5EF] rounded-input text-sm text-[#111118] placeholder-[#9999AA] focus:outline-none focus:border-[#5B4EFF]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9999AA] mb-1.5">Role</label>
                <div className="flex rounded-btn overflow-hidden border border-[#E5E5EF]">
                  {(['employee', 'hr'] as const).map((r) => (
                    <button
                      key={r}
                      id={`invite-role-${r}`}
                      onClick={() => setInviteRole(r)}
                      className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                        inviteRole === r ? 'bg-[#5B4EFF] text-white' : 'text-[#555566] hover:bg-[#F8F8FB]'
                      }`}
                    >
                      {r === 'hr' ? 'HR Admin' : 'Employee'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                id="send-invite-btn"
                className="w-full py-2.5 bg-[#5B4EFF] text-white text-sm font-semibold rounded-btn hover:opacity-90 flex items-center justify-center gap-2"
                onClick={() => {
                  toast(`Invite sent to ${inviteEmail}`, 'success')
                  setInviteModal(false)
                  setInviteEmail('')
                }}
              >
                <Mail size={14} />
                Send Invite
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
