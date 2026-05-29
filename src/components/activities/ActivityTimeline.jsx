import { Phone, MessageCircle, Mail, Users, FileText, StickyNote, ArrowRight } from 'lucide-react'
import { formatRelative } from '../../lib/utils'

const ICONS = {
  call: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
  whatsapp: { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
  email: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
  visit: { icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  proposal: { icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  note: { icon: StickyNote, color: 'text-gray-600', bg: 'bg-gray-50' },
  stage_change: { icon: ArrowRight, color: 'text-[#1B4332]', bg: 'bg-green-50' },
}

export function ActivityTimeline({ activities, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Aún no hay actividades registradas</p>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => {
        const config = ICONS[activity.activity_type] ?? ICONS.note
        const Icon = config.icon
        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                <Icon size={15} />
              </div>
              {idx < activities.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              {activity.description && (
                <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {activity.advisor?.full_name} · {formatRelative(activity.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
