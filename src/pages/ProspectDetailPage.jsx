import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Phone, MessageCircle, Mail, Plus, Send } from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { useActivities } from '../hooks/useActivities'
import { useEmailTemplates } from '../hooks/useEmails'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ProspectForm } from '../components/prospects/ProspectForm'
import { ActivityForm } from '../components/activities/ActivityForm'
import { ActivityTimeline } from '../components/activities/ActivityTimeline'
import { TemplatePicker } from '../components/emails/TemplatePicker'
import { EmailComposer } from '../components/emails/EmailComposer'
import { PIPELINE_STAGES } from '../lib/constants'
import { formatCurrency, formatDate, getSectorLabel, getParkTypeLabel, getLeadSourceLabel, getStage, whatsappLink } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import { Select } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function ProspectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { isAdmin } = useAuth()
  const { prospects, updateProspect, updateStage, deleteProspect } = useProspects()
  const { activities, loading: activitiesLoading, createActivity, refetch: refetchActivities } = useActivities(id)
  const [showEdit, setShowEdit] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const { templates, loading: templatesLoading } = useEmailTemplates()

  const prospect = prospects.find((p) => p.id === id)

  if (!prospect) {
    return (
      <div className="flex min-h-screen bg-[#F0F4F0]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Prospecto no encontrado</p>
        </div>
      </div>
    )
  }

  const stage = getStage(prospect.pipeline_stage)

  async function handleUpdate(data) {
    const { error } = await updateProspect(id, data)
    if (error) toast('Error al actualizar: ' + error.message, 'error')
    else {
      toast('Prospecto actualizado', 'success')
      setShowEdit(false)
    }
  }

  async function handleStageChange(e) {
    const newStage = e.target.value
    await updateStage(id, newStage)
    await createActivity({
      activity_type: 'stage_change',
      title: `Movido a "${PIPELINE_STAGES.find(s => s.slug === newStage)?.name}"`,
      description: '',
    })
    toast('Etapa actualizada', 'success')
  }

  async function handleDelete() {
    if (!confirm('¿Estás segura de que quieres eliminar este prospecto?')) return
    const { error } = await deleteProspect(id)
    if (error) toast('Error al eliminar', 'error')
    else {
      toast('Prospecto eliminado', 'success')
      navigate('/prospectos')
    }
  }

  async function handleAddActivity(data) {
    const { error } = await createActivity(data)
    if (error) toast('Error al registrar actividad', 'error')
    else {
      toast('Actividad registrada', 'success')
      setShowActivityForm(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={prospect.full_name}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
                <Edit size={14} /> Editar
              </Button>
              {isAdmin && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  <Trash2 size={14} /> Eliminar
                </Button>
              )}
            </div>
          }
        />
        <main className="flex-1 p-6">
          <Link to="/prospectos" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} /> Volver a prospectos
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Stage selector */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Etapa del pipeline</p>
                <Select value={prospect.pipeline_stage} onChange={handleStageChange}>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </Select>
                {stage && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-xs text-gray-500">{stage.name}</span>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl shadow-md p-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Contacto rápido</p>
                <div className="flex gap-2">
                  {prospect.phone && (
                    <>
                      <a
                        href={whatsappLink(prospect.phone, `Hola ${prospect.full_name}, te contactamos de BParkLife.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-700 text-sm hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                      <a
                        href={`tel:${prospect.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
                      >
                        <Phone size={16} /> Llamar
                      </a>
                    </>
                  )}
                  {prospect.email && (
                    <a
                      href={`mailto:${prospect.email}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <Mail size={16} /> Email
                    </a>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Información del proyecto</p>
                <Detail label="Empresa" value={prospect.company_name} />
                <Detail label="Ciudad" value={prospect.city && prospect.department ? `${prospect.city}, ${prospect.department}` : prospect.city} />
                <Detail label="Sector" value={getSectorLabel(prospect.sector)} />
                <Detail label="Tipo de parque" value={getParkTypeLabel(prospect.park_type)} />
                <Detail label="Valor estimado" value={formatCurrency(prospect.estimated_value)} />
                <Detail label="Fuente" value={getLeadSourceLabel(prospect.lead_source)} />
                <Detail label="Próx. contacto" value={formatDate(prospect.next_contact_date)} />
                {prospect.advisor && (
                  <Detail label="Asesor" value={prospect.advisor.full_name} />
                )}
              </div>

              {prospect.notes && (
                <div className="bg-white rounded-xl shadow-md p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Notas</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{prospect.notes}</p>
                </div>
              )}
            </div>

            {/* Right: timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Actividades</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowEmailModal(true)}>
                      <Send size={14} /> Enviar correo
                    </Button>
                    <Button size="sm" onClick={() => setShowActivityForm(true)}>
                      <Plus size={14} /> Registrar actividad
                    </Button>
                  </div>
                </div>
                <ActivityTimeline activities={activities} loading={activitiesLoading} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal envío de correo */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => { setShowEmailModal(false); setSelectedTemplate(null) }}
        title="Enviar correo"
        size="lg"
      >
        {selectedTemplate !== null ? (
          <EmailComposer
            template={selectedTemplate === 'blank' ? null : selectedTemplate}
            prospect={prospect}
            onBack={() => setSelectedTemplate(null)}
            onSent={() => {
              setShowEmailModal(false)
              setSelectedTemplate(null)
              refetchActivities()
            }}
          />
        ) : (
          <TemplatePicker
            templates={templates}
            loading={templatesLoading}
            onSelect={(t) => setSelectedTemplate(t)}
            onBlank={() => setSelectedTemplate('blank')}
          />
        )}
      </Modal>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Editar prospecto" size="lg">
        <ProspectForm initialData={prospect} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} />
      </Modal>

      <Modal isOpen={showActivityForm} onClose={() => setShowActivityForm(false)} title="Registrar actividad" size="sm">
        <ActivityForm onSubmit={handleAddActivity} onCancel={() => setShowActivityForm(false)} />
      </Modal>
    </div>
  )
}

function Detail({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  )
}
