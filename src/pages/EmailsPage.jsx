import { useState } from 'react'
import { Plus, Edit, Trash2, Mail, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useEmailTemplates, useSentEmails } from '../hooks/useEmails'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input, Select, Textarea } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import { formatRelative } from '../lib/utils'

const TABS = ['Plantillas', 'Historial de envíos']

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'seguimiento', label: 'Seguimiento' },
  { value: 'propuesta', label: 'Propuesta' },
  { value: 'cierre', label: 'Cierre' },
  { value: 'posventa', label: 'Posventa' },
]

export function EmailsPage() {
  const toast = useToast()
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)

  const { templates, loading: templatesLoading, createTemplate, updateTemplate, deleteTemplate } = useEmailTemplates()
  const { sentEmails, loading: sentLoading } = useSentEmails()

  async function handleSaveTemplate(data) {
    if (editingTemplate) {
      const { error } = await updateTemplate(editingTemplate.id, data)
      if (error) toast('Error al actualizar la plantilla', 'error')
      else { toast('Plantilla actualizada', 'success'); closeForm() }
    } else {
      const { error } = await createTemplate(data)
      if (error) toast('Error al crear la plantilla', 'error')
      else { toast('Plantilla creada', 'success'); closeForm() }
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta plantilla?')) return
    const { error } = await deleteTemplate(id)
    if (error) toast('Error al eliminar', 'error')
    else toast('Plantilla eliminada', 'success')
  }

  function closeForm() {
    setShowForm(false)
    setEditingTemplate(null)
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Correos"
          actions={
            isAdmin && activeTab === 0 ? (
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} /> Nueva plantilla
              </Button>
            ) : null
          }
        />
        <main className="flex-1 p-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl shadow-md p-1 mb-6 w-fit">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  activeTab === i
                    ? 'bg-[#1B4332] text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab: Plantillas */}
          {activeTab === 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templatesLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-white rounded-xl shadow-md animate-pulse" />
                ))
              ) : templates.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Mail size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400">No hay plantillas creadas</p>
                  {isAdmin && (
                    <Button className="mt-4" onClick={() => setShowForm(true)}>
                      <Plus size={16} /> Crear primera plantilla
                    </Button>
                  )}
                </div>
              ) : (
                templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    isAdmin={isAdmin}
                    onEdit={() => { setEditingTemplate(t); setShowForm(true) }}
                    onDelete={() => handleDelete(t.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Tab: Historial */}
          {activeTab === 1 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {sentLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Destinatario</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Asunto</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Plantilla</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Asesor</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Estado</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Enviado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sentEmails.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{e.to_email}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{e.subject}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{e.template?.name ?? '—'}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{e.advisor?.full_name ?? '—'}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={e.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400">{formatRelative(e.sent_at)}</td>
                      </tr>
                    ))}
                    {sentEmails.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                          Aún no se han enviado correos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingTemplate ? 'Editar plantilla' : 'Nueva plantilla'}
        size="lg"
      >
        <TemplateForm
          initialData={editingTemplate}
          onSubmit={handleSaveTemplate}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  )
}

function TemplateCard({ template, isAdmin, onEdit, onDelete }) {
  const CATEGORY_COLORS = {
    general: 'bg-gray-100 text-gray-700',
    seguimiento: 'bg-blue-100 text-blue-700',
    propuesta: 'bg-purple-100 text-purple-700',
    cierre: 'bg-green-100 text-green-700',
    posventa: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#1B4332]/10 flex items-center justify-center">
          <Mail size={18} className="text-[#1B4332]" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.general}`}>
          {CATEGORY_OPTIONS.find(c => c.value === template.category)?.label ?? template.category}
        </span>
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1">{template.name}</h4>
      <p className="text-xs text-gray-400 truncate">{template.subject}</p>
      {isAdmin && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1B4332] transition-colors"
          >
            <Edit size={13} /> Editar
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 size={13} /> Eliminar
          </button>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    sent: { icon: <CheckCircle size={13} />, label: 'Enviado', cls: 'text-green-600 bg-green-50' },
    failed: { icon: <XCircle size={13} />, label: 'Fallido', cls: 'text-red-600 bg-red-50' },
    bounced: { icon: <XCircle size={13} />, label: 'Rebotado', cls: 'text-yellow-600 bg-yellow-50' },
  }
  const c = config[status] ?? config.sent
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  )
}

function TemplateForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    html_body: '',
    category: 'general',
    ...initialData,
  })
  const [submitting, setSubmitting] = useState(false)

  function set(key, value) { setForm((prev) => ({ ...prev, [key]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nombre de la plantilla *" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <Select label="Categoría" value={form.category} onChange={(e) => set('category', e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
      </div>
      <Input label="Asunto *" value={form.subject} onChange={(e) => set('subject', e.target.value)} required placeholder="Ej: Cotización de parque para {{company_name}}" />
      <div>
        <Textarea
          label="Cuerpo HTML *"
          value={form.html_body}
          onChange={(e) => set('html_body', e.target.value)}
          rows={12}
          required
          placeholder={`<p>Hola {{full_name}},</p>\n<p>Gracias por tu interés en BParkLife...</p>`}
        />
        <p className="text-xs text-gray-400 mt-1">
          Variables disponibles:{' '}
          {['full_name', 'company_name', 'city', 'park_type', 'advisor_name', 'estimated_value'].map((v) => (
            <code key={v} className="bg-gray-100 px-1 rounded mr-1">{`{{${v}}}`}</code>
          ))}
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear plantilla'}
        </Button>
      </div>
    </form>
  )
}
