import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, Settings, LogOut, TreePine, Mail, MessageCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/crm', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/crm/prospectos', icon: Users, label: 'Prospectos' },
  { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/crm/correos', icon: Mail, label: 'Correos' },
  { to: '/crm/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
]

const adminItems = [
  { to: '/crm/admin', icon: Settings, label: 'Administración' },
]

export function Sidebar() {
  const { profile, signOut, isAdmin } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-[#0D2818] flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-[#52B788] rounded-lg flex items-center justify-center">
          <TreePine size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Parques CMR</p>
          <p className="text-white/40 text-xs">BParkLife</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/crm'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-[#52B788] text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-white/30 text-xs uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#52B788] text-white font-medium'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center text-white text-xs font-bold">
            {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{profile?.full_name}</p>
            <p className="text-white/40 text-xs capitalize">{profile?.role === 'admin' ? 'Administrador' : 'Asesor'}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors duration-150"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
