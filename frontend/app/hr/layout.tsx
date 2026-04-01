import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { StudioSidebar, NavBar } from '@/components/ui/Navigation'
import ToastContainer from '@/components/ui/Toast'

export default async function HRLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('role, email').eq('id', user.id).single()
  if (profile?.role !== 'hr') redirect('/403')

  return (
    <div className="min-h-screen bg-[#F8F8FB] studio-layout">
      <StudioSidebar />
      <NavBar theme="studio" userEmail={profile?.email ?? user.email} />
      <main id="studio-main" className="lg:ml-64 pt-16 min-h-screen">
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
