import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, MessageCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useWhatsAppTemplates } from '../../hooks/useWhatsAppTemplates'
import { useToast } from '../ui/Toast'
import { PIPELINE_STAGES } from '../../lib/constants'
import { Button } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'

const EMPTY_FORM = { name: '', stage_slug: '', message_body: '', active: true }
const VARIABLES = [
  { key: 'nombre', label: 'Nombre del prospecto' },
  { key: 'empresa', label: 'Empresa' },
  { key: 'asesor', label: 'Nombre del asesor' },
]

function preview(body) {
  return (body || '')
    .replace(/\{\{nombre\}\}/gi, 'Andrea')
    .replace(/\{\{empresa\}\}/gi, 'Conj. Reserva Verde')
    .replace(/\{\{asesor\}\}/gi, 'Tu asesora')
}

export function WhatsAppTemplateManager() {
  const toast = useToast()
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useWhatsAppTemplates()
  const [search, setSearch] = useState('')
  const [formModal, setFormModal] = useState({ open: false, template: null })
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [expandedStage, setExpandedStage] = useState(null)

  const filtered = templates.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.name?.toLowerCase().includes(q) || t.message_body?.toLowerCase().includes(q)
  })

  // Agrupar por etapa
  const grouped = {}
  filtered.forEach((t) => {
    const key = t.stage_slug || 'sin_etapa'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(t)
  })

  function getStageName(slug) {
    return PIPELINE_STAGES.find((s) => s.slug === slug)?.name || slug
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setErrors({})
    setFormModal({ open: true, template: null })
  }

  function openEdit(t) {
    setForm({ name: t.name, stage_slug: t.stage_slug, message_body: t.message_body, active: t.active })
    setErrors({})
    setFormModal({ open: true, template: t })
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Nombre obligatorio'
    if (!form.stage_slug) e.stage_slug = 'Selecciona una etapa'
    if (!form.message_body.trim()) e.message_body = 'El mensaje es obligatorio'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const payload = {
      name: form.name.trim(),
      stage_slug: form.stage_slug,
      message_body: form.message_body.trim(),
      active: form.active,
    }
    const isEditing = !!formModal.template
    const { error } = isEditing
      ? await updateTemplate(formModal.template.id, payload)
      : await createTemplate(payload)

    if (error) toast('Error al guardar: ' + error.message, 'error')
    else {
      toast(isEditing ? 'Plantilla actualizada' : 'Plantilla creada', 'success')
      setFormModal({ open: false, template: null })
    }
    setSubmitting(false)
  }

  async function handleDelete(t) {
    if (!confirm(`¿Eliminar "${t.name}"?`)) return
    const { error } = await deleteTemplate(t.id)
    if (error) toast('Error al eliminar', 'error')
    else toast('Plantilla eliminada', 'success')
  }

  async function handleToggle(t) {
    const { error } = await updateTemplate(t.id, { active: !t.active })
    if (error) toast('Error al cambiar estado', 'error')
    else toast(t.active ? 'Plantilla desactivada' : 'Plantilla activada', 'success')
  }

  function handleCopy(t) {
    navigator.clipboard.writeText(t.message_body).then(() => {
      setCopiedId(t.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  function insertVar(key) {
    setForm((f) => ({ ...f, message_body: (f.message_body || '') + `{{${key}}}` }))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle size={20} className="text-green-500" />
            Plantillas de WhatsApp
          </h2>
          <p className="text-xs text-gray-500">{templates.length} plantillas en total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Nueva plantilla
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar plantilla..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none"
        />
      </div>

      {/* Lista agrupada por etapa */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <MessageCircle size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{search ? 'Sin resultados' : 'No hay plantillas. Crea la primera.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {PIPELINE_STAGES
            .filter((s) => grouped[s.slug])
            .map((stage) => {
              const isExpanded = expandedStage === null || expandedStage === stage.slug
              return (
                <div key={stage.slug} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <button
                    onClick={() => setExpandedStage(isExpanded && expandedStage !== null ? null : stage.slug)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-sm font-semibold text-gray-800">{stage.name}</span>
                      <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
                        {grouped[stage.slug].length}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-gray-50">
                      {grouped[stage.slug].map((t) => (
                        <div key={t.id} className={`px-5 py-4 ${!t.active ? 'opacity-50' : ''}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-900">{t.name}</p>
                                {!t.active && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500">Inactiva</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 whitespace-pre-wrap">
                                {preview(t.message_body)}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                onClick={() => handleCopy(t)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                                title="Copiar mensaje"
                              >
                                {copiedId === t.id ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                              </button>
                              <button
                                onClick={() => handleToggle(t)}
                                className={`p-2 rounded-lg transition-colors ${t.active ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title={t.active ? 'Desactivar' : 'Activar'}
                              >
                                <MessageCircle size={15} />
                              </button>
                              <button
                                onClick={() => openEdit(t)}
                                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                                title="Editar"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(t)}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, template: null })}
        title={formModal.template ? 'Editar plantilla de WhatsApp' : 'Nueva plantilla de WhatsApp'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
            placeholder="Ej: Seguimiento inicial"
          />

          <Select
            label="Etapa del pipeline *"
            value={form.stage_slug}
            onChange={(e) => setForm((f) => ({ ...f, stage_slug: e.target.value }))}
            error={errors.stage_slug}
          >
            <option value="">Seleccionar etapa...</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {VARIABLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insertVar(v.key)}
                  className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-mono hover:bg-green-100 transition-colors"
                  title={v.label}
                >
                  {`{{${v.key}}}`}
                </button>
              ))}
            </div>
            <textarea
              value={form.message_body}
              onChange={(e) => setForm((f) => ({ ...f, message_body: e.target.value }))}
              placeholder="Escribe el mensaje... Usa las variables de arriba para personalizar."
              rows={5}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all resize-y ${
                errors.message_body ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.message_body && <p className="text-xs text-red-500 mt-1">{errors.message_body}</p>}
          </div>

          {/* Preview */}
          {form.message_body && (
            <div className="bg-[#E5DDD5] rounded-lg p-3">
              <p className="text-[10px] font-medium text-gray-600 mb-2">Vista previa:</p>
              <div className="bg-[#DCF8C6] rounded-lg px-3 py-2 max-w-xs shadow-sm">
                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">{preview(form.message_body)}</p>
                <p className="text-[9px] text-gray-500 text-right mt-1">Vista previa ✓✓</p>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="rounded border-gray-300 text-green-500 focus:ring-green-500"
            />
            Plantilla activa (visible para asesores)
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setFormModal({ open: false, template: null })}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : formModal.template ? 'Guardar cambios' : 'Crear plantilla'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
