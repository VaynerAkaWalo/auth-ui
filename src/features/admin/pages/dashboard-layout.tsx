import { memo, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout/layout'
import { Sidebar } from '@/components/layout/sidebar'
import { useKeepAlive } from '@/hooks/use-keep-alive'
import { logout, whoAmI, type WhoAmIResponse } from '@/lib/api'
import { LogOut, Loader2 } from 'lucide-react'

const LogoutButton = memo(function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      const response = await logout()
      if (response.ok) {
        toast.success('Logged out successfully')
        navigate('/login')
      } else {
        toast.error('Logout failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="h-9 px-4 text-sm font-medium tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-150"
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  )
})

export default function DashboardLayout() {
  const [user, setUser] = useState<WhoAmIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useKeepAlive({ interval: 60000 })

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await whoAmI()
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          toast.error('Session expired')
          navigate('/login')
        }
      } catch {
        toast.error('Failed to verify session')
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-foreground mx-auto mb-4" />
          <p className="text-sm font-mono text-muted tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout headerRightContent={<LogoutButton />} sidebar={<Sidebar />}>
      <Outlet context={{ user }} />
    </Layout>
  )
}
