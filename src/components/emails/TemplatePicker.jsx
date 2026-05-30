import { Mail, ChevronRight } from 'lucide-react'

const CATEGORY_LABELS = {
  general: 'General',
  seguimiento: 'Seguimiento',
  propuesta: 'Propuesta',
  cierre: 'Cierre',
  posventa: 'Posventa',
}

const CATEGORY_COLORS = {
  general: 'bg-gray-100 text-gray-700',
  seguimiento: 'bg-blue-100 text-blue-700',
  propuesta: 'bg-purple-100 text-purple-700',
  cierre: 'bg-green-100 text-green-700',
  posventa: 'bg-yellow-100 text-yellow-700',
}

export function TemplatePicker({ templates, onSelect, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">No hay plantillas disponibles</p>
        <p className="text-xs text-gray-400">El administrador debe crear plantillas primero</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#1B4332] hover:bg-green-50 transition-all duration-150 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1B4332]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1B4332]/20">
            <Mail size={18} className="text-[#1B4332]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{template.name}</p>
            <p className="text-xs text-gray-400 truncate">{template.subject}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.general}`}>
            {CATEGORY_LABELS[template.category] ?? template.category}
          </span>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1B4332] shrink-0" />
        </button>
      ))}
    </div>
  )
}
