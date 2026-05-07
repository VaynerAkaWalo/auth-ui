import { useOutletContext } from 'react-router-dom'
import { User } from 'lucide-react'

interface DashboardContext {
  user: { id: string; name: string } | null
}

export default function Overview() {
  const { user } = useOutletContext<DashboardContext>()

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h2 className="text-4xl tracking-[0.1em] mb-2">Dashboard</h2>
        <p className="text-sm font-mono text-muted">You are successfully authenticated</p>
        <div className="w-12 h-0.5 bg-foreground mt-4" />
      </div>

      <div className="brutal-border-light bg-surface p-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 brutal-border-light bg-background flex items-center justify-center shrink-0">
            <User className="h-7 w-7 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono text-muted tracking-widest uppercase mb-1">Logged in as</p>
            <p className="text-xl font-mono font-medium truncate">{user?.name}</p>
            {user?.id ? (
              <p className="text-xs font-mono text-muted mt-1 truncate">ID: {user.id}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
