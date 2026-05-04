import { NavLink } from 'react-router-dom'
import { LayoutDashboard, KeyRound } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: '/dashboard/jwks', label: 'JWKS Keys', icon: <KeyRound className="h-4 w-4" /> },
]

export function Sidebar() {
  return (
    <aside className="w-56 border-r bg-card flex flex-col shrink-0">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
