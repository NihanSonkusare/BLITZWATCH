import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { TheaterSidebar, NavBar } from '@/components/ui/Navigation'
import CustomCursor from '@/components/ui/CustomCursor'
import LenisProvider from '@/components/ui/LenisProvider'
import ToastContainer from '@/components/ui/Toast'

export default async function TheaterLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('role, email').eq('id', user.id).single()
  if (profile?.role !== 'employee') redirect('/hr/studio')

  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#0A0A0F] theater-layout">
        <CustomCursor />
        <TheaterSidebar />
        <NavBar theme="theater" userEmail={profile?.email ?? user.email} />
        <main id="theater-main" className="lg:ml-60 pt-16 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
        <ToastContainer />
      </div>
    </LenisProvider>
  )
}
