import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function TopBar({ title, actions }) {
  const { profile } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors relative">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center text-white text-xs font-bold">
          {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    </header>
  )
}
