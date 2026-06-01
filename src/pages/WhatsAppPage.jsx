import { useState, useEffect, useMemo } from 'react'
import { MessageCircle, Search, User, Building2, Phone, Send, ExternalLink, Check, FileText } from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { useWhatsAppTemplates } from '../hooks/useWhatsAppTemplates'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { WhatsAppTemplateManager } from '../components/admin/WhatsAppTemplateManager'
import { PIPELINE_STAGES } from '../lib/constants'
import { whatsappLink } from '../lib/utils'

function replaceVars(body, name, company, advisor) {
  const first = name?.split(' ')[0] || ''
  return (body || '')
    .replace(/\{\{nombre\}\}/gi, first)
    .replace(/\{\{empresa\}\}/gi, company || '')
    .replace(/\{\{asesor\}\}/gi, advisor || 'Tu asesor')
}

function getStageName(slug) {
  return PIPELINE_STAGES.find((s) => s.slug === slug)?.name || slug
}

function getStageColor(slug) {
  return PIPELINE_STAGES.find((s) => s.slug === slug)?.color || '#6B7280'
}

export function WhatsAppPage() {
  const { profile, isAdmin } = useAuth()
  const { prospects, loading: prospectsLoading } = useProspects()
  const { templates, loading: templatesLoading } = useWhatsAppTemplates()

  const [activeTab, setActiveTab] = useState('send')
  const [searchProspect, setSearchProspect] = useState('')
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customMessage, setCustomMessage] = useState('')
  const [sentId, setSentId] = useState(null)

  // Prospectos con teléfono filtrados
  const filteredProspects = useMemo(() => {
    return prospects
      .filter((p) => p.phone)
      .filter((p) => {
        if (!searchProspect) return true
        const q = searchProspect.toLowerCase()
        return (
          p.full_name?.toLowerCase().includes(q) ||
          p.company_name?.toLowerCase().includes(q) ||
          p.phone?.includes(q)
        )
      })
  }, [prospects, searchProspect])

  // Plantillas activas, ordenadas: etapa actual primero
  const availableTemplates = useMemo(() => {
    const active = templates.filter((t) => t.active)
    if (!selectedProspect) return active
    return [...active].sort((a, b) => {
      const aMatch = a.stage_slug === selectedProspect.pipeline_stage ? 0 : 1
      const bMatch = b.stage_slug === selectedProspect.pipeline_stage ? 0 : 1
      return aMatch - bMatch
    })
  }, [templates, selectedProspect])

  // Actualizar mensaje al cambiar plantilla o prospecto
  useEffect(() => {
    if (selectedTemplate && selectedProspect) {
      setCustomMessage(
        replaceVars(selectedTemplate.message_body, selectedProspect.full_name, selectedProspect.company_name, profile?.full_name)
      )
    }
  }, [selectedTemplate, selectedProspect, profile?.full_name])

  // Reset al cambiar prospecto
  useEffect(() => {
    setSelectedTemplate(null)
    setCustomMessage('')
  }, [selectedProspect?.id])

  function handleSend() {
    if (!selectedProspect || !customMessage.trim()) return
    window.open(whatsappLink(selectedProspect.phone, customMessage), '_blank')
    setSentId(selectedProspect.id)
    setTimeout(() => setSentId(null), 3000)
  }

  const tabs = [
    { value: 'send', label: 'Enviar mensaje' },
    ...(isAdmin ? [{ value: 'templates', label: 'Gestionar plantillas' }] : []),
  ]

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="WhatsApp" />
        <main className="flex-1 p-6">

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setActiveTab(t.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === t.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── TAB: ENVIAR MENSAJE ─── */}
          {activeTab === 'send' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Paso 1: Seleccionar prospecto */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white text-xs font-bold flex items-center justify-center">1</div>
                  <h3 className="text-sm font-bold text-gray-900">Selecciona prospecto</h3>
                </div>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchProspect}
                    onChange={(e) => setSearchProspect(e.target.value)}
                    placeholder="Nombre, empresa o teléfono..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none"
                  />
                </div>
                <div className="max-h-[480px] overflow-y-auto space-y-1.5 pr-1">
                  {prospectsLoading ? (
                    [1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)
                  ) : filteredProspects.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">
                      {searchProspect ? 'Sin resultados.' : 'No hay prospectos con teléfono registrado.'}
                    </p>
                  ) : (
                    filteredProspects.map((p) => {
                      const isSelected = selectedProspect?.id === p.id
                      const stageColor = getStageColor(p.pipeline_stage)
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProspect(p)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                            isSelected
                              ? 'bg-green-50 border-[#52B788] shadow-sm'
                              : 'bg-white border-gray-200 hover:border-[#52B788]/50 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <User size={12} className="text-gray-400 shrink-0" />
                            <span className="text-sm font-semibold text-gray-900 truncate">{p.full_name}</span>
                          </div>
                          {p.company_name && (
                            <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mb-0.5">
                              <Building2 size={10} /> {p.company_name}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Phone size={10} /> {p.phone}
                          </p>
                          {p.pipeline_stage && (
                            <p className="text-[9px] font-medium mt-1" style={{ color: stageColor }}>
                              {getStageName(p.pipeline_stage)}
                            </p>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Paso 2: Seleccionar plantilla */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    selectedProspect ? 'bg-[#1B4332] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>2</div>
                  <h3 className="text-sm font-bold text-gray-900">Selecciona plantilla</h3>
                </div>

                {!selectedProspect ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Primero elige un prospecto</p>
                  </div>
                ) : templatesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
                  </div>
                ) : availableTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageCircle size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No hay plantillas activas.</p>
                    {isAdmin && (
                      <button onClick={() => setActiveTab('templates')} className="text-xs text-[#52B788] mt-1 hover:underline">
                        Crear plantilla →
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-gray-400 mb-2">
                      {availableTemplates.length} plantilla{availableTemplates.length !== 1 ? 's' : ''} · las de la etapa actual primero
                    </p>
                    <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
                      {availableTemplates.map((t) => {
                        const isSelected = selectedTemplate?.id === t.id
                        const matchesStage = t.stage_slug === selectedProspect.pipeline_stage
                        const stageColor = getStageColor(t.stage_slug)
                        return (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              isSelected
                                ? 'bg-green-50 border-green-500 shadow-sm'
                                : 'bg-white border-gray-200 hover:border-green-400 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                              <div className="flex items-center gap-1 shrink-0">
                                {matchesStage && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                    Etapa actual
                                  </span>
                                )}
                                {isSelected && <Check size={13} className="text-green-600" />}
                              </div>
                            </div>
                            <p className="text-[10px] font-medium mb-1" style={{ color: stageColor }}>
                              {getStageName(t.stage_slug)}
                            </p>
                            <p className="text-[10px] text-gray-500 line-clamp-2">
                              {replaceVars(t.message_body, selectedProspect.full_name, selectedProspect.company_name, profile?.full_name)}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Paso 3: Revisar y enviar */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    selectedProspect && customMessage ? 'bg-[#1B4332] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>3</div>
                  <h3 className="text-sm font-bold text-gray-900">Revisa y envía</h3>
                </div>

                {!selectedProspect ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageCircle size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Selecciona un prospecto y una plantilla para continuar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Destinatario */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Para</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedProspect.full_name}</p>
                      {selectedProspect.company_name && (
                        <p className="text-xs text-gray-500">{selectedProspect.company_name}</p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {selectedProspect.phone}
                      </p>
                    </div>

                    {/* Editor del mensaje */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                        Mensaje (editable)
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Selecciona una plantilla o escribe directamente..."
                        rows={7}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-y"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">{customMessage.length} caracteres</p>
                    </div>

                    {/* Preview burbuja WhatsApp */}
                    {customMessage && (
                      <div className="bg-[#E5DDD5] rounded-lg p-3">
                        <div className="bg-[#DCF8C6] rounded-lg px-3 py-2 max-w-full shadow-sm">
                          <p className="text-xs text-[#111b21] whitespace-pre-wrap leading-relaxed">{customMessage}</p>
                          <p className="text-[9px] text-[#667781] text-right mt-1">Vista previa ✓✓</p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleSend}
                      disabled={!customMessage.trim()}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      {sentId === selectedProspect.id ? (
                        <><Check size={16} /> Abierto en WhatsApp</>
                      ) : (
                        <><Send size={16} /> Abrir en WhatsApp<ExternalLink size={13} /></>
                      )}
                    </Button>
                    <p className="text-[10px] text-gray-400 text-center">
                      Se abrirá wa.me con el mensaje listo para enviar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── TAB: GESTIONAR PLANTILLAS (admin) ─── */}
          {activeTab === 'templates' && isAdmin && <WhatsAppTemplateManager />}

        </main>
      </div>
    </div>
  )
}
