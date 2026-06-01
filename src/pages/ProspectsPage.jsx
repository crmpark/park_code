import { useState } from 'react'
import { Link } from 'react-router-dom'
import { differenceInDays, parseISO, isToday, isPast } from 'date-fns'
import { Plus, Search, Phone, MessageCircle, AlertTriangle, Clock } from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ProspectForm } from '../components/prospects/ProspectForm'
import { SECTORS, PARK_TYPES, PIPELINE_STAGES } from '../lib/constants'
import { formatCurrency, formatDate, getSectorLabel, getParkTypeLabel, getStage, whatsappLink } from '../lib/utils'
import { useToast } from '../components/ui/Toast'

export function ProspectsPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterSector, setFilterSector] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { prospects, loading, createProspect } = useProspects({
    search,
    stage: filterStage || undefined,
    sector: filterSector || undefined,
  })

  async function handleCreate(data) {
    const { error } = await createProspect(data)
    if (error) toast('Error al crear el prospecto: ' + error.message, 'error')
    else {
      toast('Prospecto creado exitosamente', 'success')
      setShowForm(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Prospectos"
          actions={
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} /> Nuevo prospecto
            </Button>
          }
        />
        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, empresa, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#1B4332] outline-none"
            >
              <option value="">Todas las etapas</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#1B4332] outline-none"
            >
              <option value="">Todos los sectores</option>
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Nombre / Empresa</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Sector</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tipo de parque</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Etapa</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Valor est.</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Próx. contacto</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prospects.map((p) => {
                    const stage = getStage(p.pipeline_stage)
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/crm/prospectos/${p.id}`} className="hover:underline">
                            <p className="text-sm font-medium text-gray-900">{p.full_name}</p>
                            {p.company_name && <p className="text-xs text-gray-400">{p.company_name}</p>}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{getSectorLabel(p.sector)}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{getParkTypeLabel(p.park_type)}</td>
                        <td className="px-4 py-4">
                          {stage && (
                            <span
                              className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                              style={{ backgroundColor: stage.color + '20', color: stage.color }}
                            >
                              {stage.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{formatCurrency(p.estimated_value)}</td>
                        <td className="px-4 py-4">
                          <NextContactCell date={p.next_contact_date} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {p.phone && (
                              <a
                                href={whatsappLink(p.phone)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                              >
                                <MessageCircle size={16} />
                              </a>
                            )}
                            {p.phone && (
                              <a
                                href={`tel:${p.phone}`}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Phone size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {prospects.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No se encontraron prospectos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nuevo prospecto" size="lg">
        <ProspectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

function NextContactCell({ date }) {
  if (!date) return <span className="text-gray-300 text-sm">—</span>

  const parsed = parseISO(date)
  const days = differenceInDays(parsed, new Date())

  if (isToday(parsed)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        <Clock size={11} /> Hoy
      </span>
    )
  }

  if (isPast(parsed)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
        <AlertTriangle size={11} /> {Math.abs(days)}d atrás
      </span>
    )
  }

  if (days <= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
        <Clock size={11} /> En {days}d
      </span>
    )
  }

  return <span className="text-sm text-gray-500">{formatDate(date)}</span>
}
