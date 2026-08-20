import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/',        label: 'Dashboard', icon: 'grid_view' },
  { to: '/settings', label: 'Profil',   icon: 'person_celebrate' },
]

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe pt-2 bg-surface-container shadow-nav rounded-t-xl">
      {navItems.map(item => {
        const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={() =>
              `flex flex-col items-center justify-center transition-all duration-300 ease-out rounded-full ${
                isActive
                  ? 'bg-primary-container text-on-primary-container px-4 py-1'
                  : 'text-on-surface-variant p-2 hover:bg-surface-variant'
              }`
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-label-sm font-label-sm mt-0.5">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
