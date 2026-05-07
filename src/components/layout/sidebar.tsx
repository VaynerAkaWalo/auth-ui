import { NavLink } from 'react-router-dom'
import { LayoutDashboard, KeyRound, Users } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: '/dashboard/jwks', label: 'JWKS Keys', icon: <KeyRound className="h-5 w-5" /> },
  { to: '/dashboard/clients', label: 'Clients', icon: <Users className="h-5 w-5" /> },
]

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 brutal-border-right bg-background flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wider uppercase transition-colors duration-150 ${
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted hover:bg-elevated hover:text-foreground'
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
