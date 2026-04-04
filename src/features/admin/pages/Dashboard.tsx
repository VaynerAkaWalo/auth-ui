import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout, whoAmI, type WhoAmIResponse } from '@/lib/api'
import { User, LogOut, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<WhoAmIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Dashboard</CardTitle>
          <CardDescription className="text-center">
            You are successfully authenticated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="text-lg font-semibold">{user?.name}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
            disabled={isLoggingOut}
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
        </CardContent>
      </Card>
      <div className="fixed bottom-4 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground">blamedevs © 2026</span>
      </div>
    </div>
  )
}
