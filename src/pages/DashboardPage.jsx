import { useProspects } from '../hooks/useProspects'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { PIPELINE_STAGES } from '../lib/constants'
import { formatCurrency, formatRelative, getStage } from '../lib/utils'
import { Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { profile, isAdmin } = useAuth()
  const { prospects, loading } = useProspects()

  const active = prospects.filter((p) => p.pipeline_stage !== 'perdido')
  const closed = prospects.filter((p) => p.pipeline_stage === 'cierre' || p.pipeline_stage === 'instalacion' || p.pipeline_stage === 'posventa')
  const totalValue = active.reduce((sum, p) => sum + (p.estimated_value ?? 0), 0)
  const overdue = prospects.filter((p) => p.next_contact_date && new Date(p.next_contact_date) < new Date() && p.pipeline_stage !== 'perdido')

  const byStage = PIPELINE_STAGES.map((s) => ({
    ...s,
    count: prospects.filter((p) => p.pipeline_stage === s.slug).length,
  }))

  const recentProspects = [...prospects].slice(0, 5)

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={isAdmin ? 'Dashboard General' : `Hola, ${profile?.full_name?.split(' ')[0]}`} />
        <main className="flex-1 p-6 space-y-6">

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={<Users size={20} />} label="Prospectos activos" value={active.length} color="text-blue-600" bg="bg-blue-50" />
            <MetricCard icon={<TrendingUp size={20} />} label="Cierres / Instalaciones" value={closed.length} color="text-green-600" bg="bg-green-50" />
            <MetricCard icon={<DollarSign size={20} />} label="Valor en pipeline" value={formatCurrency(totalValue)} color="text-yellow-600" bg="bg-yellow-50" />
            <MetricCard icon={<AlertCircle size={20} />} label="Pendientes por contactar" value={overdue.length} color="text-red-600" bg="bg-red-50" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pipeline summary */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estado del Pipeline</h3>
              <div className="space-y-2">
                {byStage.filter(s => s.slug !== 'perdido').map((s) => (
                  <div key={s.slug} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-gray-600 flex-1">{s.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent prospects */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Prospectos recientes</h3>
                <Link to="/prospectos" className="text-sm text-[#1B4332] hover:underline">Ver todos</Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProspects.map((p) => {
                    const stage = getStage(p.pipeline_stage)
                    return (
                      <Link
                        key={p.id}
                        to={`/prospectos/${p.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.full_name}</p>
                          <p className="text-xs text-gray-400">{p.company_name || p.city} · {formatRelative(p.created_at)}</p>
                        </div>
                        {stage && (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: stage.color + '20', color: stage.color }}
                          >
                            {stage.name}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                  {recentProspects.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Aún no hay prospectos</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
