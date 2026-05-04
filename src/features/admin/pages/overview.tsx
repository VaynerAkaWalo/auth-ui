import { useOutletContext } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'

interface DashboardContext {
  user: { id: string; name: string } | null
}

export default function Overview() {
  const { user } = useOutletContext<DashboardContext>()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Dashboard</CardTitle>
        <CardDescription>
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
      </CardContent>
    </Card>
  )
}
