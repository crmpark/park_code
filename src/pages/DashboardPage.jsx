import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { differenceInDays, isToday, isPast, parseISO } from 'date-fns'
import {
  Users, TrendingUp, DollarSign, AlertCircle, Phone,
  Clock, Award, BarChart2, AlertTriangle, CheckCircle2,
  ArrowRight, Flame
} from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { PIPELINE_STAGES, SECTORS } from '../lib/constants'
import { formatCurrency, formatDate, getStage, getSectorLabel } from '../lib/utils'

const COMMISSION_RATE = 0.10

// Probabilidad de cierre estimada por etapa (para pronóstico)
const STAGE_PROBABILITY = {
  lead_nuevo: 0.05,
  diagnostico: 0.15,
  diseno_cotizacion: 0.25,
  propuesta_enviada: 0.40,
  negociacion: 0.65,
  cierre: 0.90,
  instalacion: 1.0,
  posventa: 1.0,
  perdido: 0,
}

export function DashboardPage() {
  const { profile, isAdmin } = useAuth()
  const { prospects, loading } = useProspects()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const metrics = useMemo(() => {
    const active = prospects.filter((p) => p.pipeline_stage !== 'perdido')
    const lost = prospects.filter((p) => p.pipeline_stage === 'perdido')
    const closed = prospects.filter((p) => ['cierre', 'instalacion', 'posventa'].includes(p.pipeline_stage))

    // Hoy
    const callsToday = prospects.filter((p) => {
      if (!p.next_contact_date || p.pipeline_stage === 'perdido') return false
      return isToday(parseISO(p.next_contact_date))
    })

    // Vencidos (fecha de contacto pasada, sin cerrar)
    const overdue = prospects.filter((p) => {
      if (!p.next_contact_date || p.pipeline_stage === 'perdido') return false
      const d = parseISO(p.next_contact_date)
      return isPast(d) && !isToday(d)
    })

    // Inactividad (sin next_contact_date o con último contacto hace mucho)
    const stale7 = active.filter((p) => {
      if (!p.updated_at) return true
      return differenceInDays(new Date(), parseISO(p.updated_at)) >= 7
    })

    // Pipeline value
    const totalPipelineValue = active.reduce((s, p) => s + (p.estimated_value ?? 0), 0)
    const closedValue = closed.reduce((s, p) => s + (p.estimated_value ?? 0), 0)

    // Comisiones
    const commissionPotential = totalPipelineValue * COMMISSION_RATE
    const commissionEarned = closedValue * COMMISSION_RATE

    // Pronóstico ponderado
    const weightedForecast = active.reduce((s, p) => {
      const prob = STAGE_PROBABILITY[p.pipeline_stage] ?? 0
      return s + (p.estimated_value ?? 0) * prob
    }, 0)
    const commissionForecast = weightedForecast * COMMISSION_RATE

    // Valor promedio
    const avgDealValue = active.length > 0 ? totalPipelineValue / active.length : 0

    // Tasa de conversión
    const total = prospects.length
    const conversionRate = total > 0 ? Math.round((closed.length / total) * 100) : 0

    // Top 5 oportunidades
    const topDeals = [...active]
      .filter((p) => p.estimated_value)
      .sort((a, b) => (b.estimated_value ?? 0) - (a.estimated_value ?? 0))
      .slice(0, 5)

    // Por sector
    const bySector = SECTORS.map((s) => ({
      ...s,
      count: active.filter((p) => p.sector === s.value).length,
      value: active.filter((p) => p.sector === s.value).reduce((sum, p) => sum + (p.estimated_value ?? 0), 0),
    })).filter((s) => s.count > 0).sort((a, b) => b.value - a.value)

    // Por etapa con valor
    const byStage = PIPELINE_STAGES.filter(s => s.slug !== 'perdido').map((s) => ({
      ...s,
      count: prospects.filter((p) => p.pipeline_stage === s.slug).length,
      value: prospects.filter((p) => p.pipeline_stage === s.slug).reduce((sum, p) => sum + (p.estimated_value ?? 0), 0),
    }))

    return {
      active, lost, closed, callsToday, overdue, stale7,
      totalPipelineValue, closedValue,
      commissionPotential, commissionEarned, commissionForecast,
      avgDealValue, conversionRate, topDeals, bySector, byStage,
      weightedForecast,
    }
  }, [prospects])

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={isAdmin ? 'Dashboard Comercial' : `Hola, ${firstName} 👋`} />
        <main className="flex-1 p-6 space-y-6 overflow-auto">

          {/* ── PANEL DEL DÍA ── */}
          <div className="bg-[#0D2818] rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} className="text-[#52B788]" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-[#52B788]">Mi día de hoy</h2>
              <span className="text-white/30 text-xs ml-auto">{formatDate(new Date().toISOString())}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Llamadas del día */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone size={16} className="text-blue-300" />
                  <p className="text-xs font-medium text-white/70">Llamadas programadas hoy</p>
                </div>
                {metrics.callsToday.length === 0 ? (
                  <p className="text-white/40 text-sm">Sin llamadas para hoy</p>
                ) : (
                  <div className="space-y-2">
                    {metrics.callsToday.slice(0, 4).map((p) => (
                      <Link key={p.id} to={`/crm/prospectos/${p.id}`} className="flex items-center justify-between hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{p.full_name}</p>
                          <p className="text-xs text-white/40">{p.company_name}</p>
                        </div>
                        <ArrowRight size={14} className="text-white/30" />
                      </Link>
                    ))}
                    {metrics.callsToday.length > 4 && (
                      <p className="text-xs text-white/40">+{metrics.callsToday.length - 4} más</p>
                    )}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-2xl font-bold text-white">{metrics.callsToday.length}</span>
                  <span className="text-white/40 text-xs ml-1">contactos</span>
                </div>
              </div>

              {/* Vencidos */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-300" />
                  <p className="text-xs font-medium text-white/70">Atrasados por contactar</p>
                </div>
                {metrics.overdue.length === 0 ? (
                  <p className="text-white/40 text-sm">¡Todo al día! 🎉</p>
                ) : (
                  <div className="space-y-2">
                    {metrics.overdue.slice(0, 4).map((p) => {
                      const days = differenceInDays(new Date(), parseISO(p.next_contact_date))
                      return (
                        <Link key={p.id} to={`/crm/prospectos/${p.id}`} className="flex items-center justify-between hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-white leading-tight">{p.full_name}</p>
                            <p className="text-xs text-red-300">{days}d atrasado</p>
                          </div>
                          <ArrowRight size={14} className="text-white/30" />
                        </Link>
                      )
                    })}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-2xl font-bold text-red-300">{metrics.overdue.length}</span>
                  <span className="text-white/40 text-xs ml-1">atrasados</span>
                </div>
              </div>

              {/* Sin actividad */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-yellow-300" />
                  <p className="text-xs font-medium text-white/70">Sin actividad +7 días</p>
                </div>
                {metrics.stale7.length === 0 ? (
                  <p className="text-white/40 text-sm">Pipeline activo 💪</p>
                ) : (
                  <div className="space-y-2">
                    {metrics.stale7.slice(0, 4).map((p) => {
                      const days = differenceInDays(new Date(), parseISO(p.updated_at))
                      return (
                        <Link key={p.id} to={`/crm/prospectos/${p.id}`} className="flex items-center justify-between hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-white leading-tight">{p.full_name}</p>
                            <p className="text-xs text-yellow-300">{days}d sin contacto</p>
                          </div>
                          <ArrowRight size={14} className="text-white/30" />
                        </Link>
                      )
                    })}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-2xl font-bold text-yellow-300">{metrics.stale7.length}</span>
                  <span className="text-white/40 text-xs ml-1">prospectos</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MÉTRICAS PRINCIPALES ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Users size={20} />}
              label="Prospectos activos"
              value={metrics.active.length}
              sub={`${metrics.conversionRate}% tasa de conversión`}
              color="text-blue-600" bg="bg-blue-50"
            />
            <MetricCard
              icon={<DollarSign size={20} />}
              label="Valor en pipeline"
              value={formatCurrency(metrics.totalPipelineValue)}
              sub={`Promedio: ${formatCurrency(metrics.avgDealValue)}`}
              color="text-green-600" bg="bg-green-50"
            />
            <MetricCard
              icon={<TrendingUp size={20} />}
              label="Pronóstico ponderado"
              value={formatCurrency(metrics.weightedForecast)}
              sub="Basado en probabilidad por etapa"
              color="text-purple-600" bg="bg-purple-50"
            />
            <MetricCard
              icon={<AlertCircle size={20} />}
              label="Pendientes hoy"
              value={metrics.callsToday.length + metrics.overdue.length}
              sub={`${metrics.callsToday.length} hoy · ${metrics.overdue.length} atrasados`}
              color="text-red-600" bg="bg-red-50"
              urgent={metrics.overdue.length > 0}
            />
          </div>

          {/* ── COMISIONES ── */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award size={18} className="text-[#1B4332]" />
              <h3 className="font-semibold text-gray-900">Comisiones esperadas (10%)</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <CommissionBlock
                label="Comisión total del pipeline"
                value={metrics.commissionPotential}
                sub="Si se cierran todos los deals activos"
                color="text-gray-900"
              />
              <CommissionBlock
                label="Comisión probable (ponderada)"
                value={metrics.commissionForecast}
                sub="Estimado real según etapa de cada deal"
                color="text-[#1B4332]"
                highlight
              />
              <CommissionBlock
                label="Comisión ya ganada"
                value={metrics.commissionEarned}
                sub="Deals cerrados / en instalación"
                color="text-green-600"
              />
            </div>

            {/* Desglose por etapa */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Comisión esperada por etapa</p>
              <div className="space-y-2">
                {metrics.byStage.filter(s => s.value > 0).map((s) => {
                  const prob = STAGE_PROBABILITY[s.slug] ?? 0
                  const commission = s.value * COMMISSION_RATE
                  const weighted = commission * prob
                  return (
                    <div key={s.slug} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-sm text-gray-600 w-40 shrink-0">{s.name}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${prob * 100}%`, backgroundColor: s.color }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-16 text-right">{Math.round(prob * 100)}%</span>
                      <span className="text-sm font-semibold text-gray-900 w-32 text-right">{formatCurrency(weighted)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Top negociaciones */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 size={18} className="text-[#1B4332]" />
                  <h3 className="font-semibold text-gray-900">Top oportunidades activas</h3>
                </div>
                <Link to="/crm/prospectos" className="text-sm text-[#1B4332] hover:underline">Ver todas</Link>
              </div>
              {loading ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
              ) : metrics.topDeals.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Agrega valor estimado a tus prospectos para verlos aquí</p>
              ) : (
                <div className="space-y-2">
                  {metrics.topDeals.map((p, idx) => {
                    const stage = getStage(p.pipeline_stage)
                    const commission = (p.estimated_value ?? 0) * COMMISSION_RATE
                    const inactivity = p.updated_at ? differenceInDays(new Date(), parseISO(p.updated_at)) : null
                    return (
                      <Link
                        key={p.id}
                        to={`/crm/prospectos/${p.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-lg font-bold text-gray-200 w-6 shrink-0">#{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.full_name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.company_name || getSectorLabel(p.sector)}</p>
                        </div>
                        {stage && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
                            style={{ backgroundColor: stage.color + '20', color: stage.color }}>
                            {stage.name}
                          </span>
                        )}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(p.estimated_value)}</p>
                          <p className="text-xs text-[#1B4332]">Comisión: {formatCurrency(commission)}</p>
                        </div>
                        <InactivityDot days={inactivity} />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pipeline por etapa + sector */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-5">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Pipeline por etapa</h4>
                <div className="space-y-2">
                  {metrics.byStage.filter(s => s.count > 0 && s.slug !== 'perdido').map((s) => (
                    <div key={s.slug} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-gray-600 flex-1 truncate">{s.name}</span>
                      <span className="text-xs font-bold text-gray-900">{s.count}</span>
                      {s.value > 0 && <span className="text-xs text-gray-400">{formatCurrency(s.value)}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {metrics.bySector.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-5">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Pipeline por sector</h4>
                  <div className="space-y-2">
                    {metrics.bySector.slice(0, 6).map((s) => (
                      <div key={s.value} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 flex-1 truncate">{s.label}</span>
                        <span className="text-xs font-bold text-gray-900">{s.count}</span>
                        {s.value > 0 && <span className="text-xs text-gray-400">{formatCurrency(s.value)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

// ── Componentes auxiliares ──

function MetricCard({ icon, label, value, sub, color, bg, urgent }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200 ${urgent ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function CommissionBlock({ label, value, sub, color, highlight }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-[#1B4332]/5 border border-[#1B4332]/20' : 'bg-gray-50'}`}>
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

function InactivityDot({ days }) {
  if (days === null) return null
  if (days < 7) return <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" title="Activo" />
  if (days < 14) return <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" title={`${days}d sin actividad`} />
  return <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" title={`${days}d sin actividad`} />
}
