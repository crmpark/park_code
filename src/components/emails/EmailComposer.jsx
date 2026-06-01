import { useState } from 'react'
import { ArrowLeft, Send, Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { useSendEmail } from '../../hooks/useEmails'
import { useToast } from '../ui/Toast'

// Reemplaza variables {{key}} con los datos del prospecto
function renderPreview(text, prospect) {
  if (!text || !prospect) return text
  const vars = {
    full_name: prospect.full_name ?? '',
    company_name: prospect.company_name ?? '',
    city: prospect.city ?? '',
    park_type: prospect.park_type ?? '',
    advisor_name: prospect.advisor?.full_name ?? '',
    estimated_value: prospect.estimated_value
      ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(prospect.estimated_value)
      : '',
  }
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

export function EmailComposer({ template, prospect, onBack, onSent }) {
  const toast = useToast()
  const { sendEmail, sending } = useSendEmail()
  const [showPreview, setShowPreview] = useState(false)
  const [subject, setSubject] = useState(template?.subject ?? '')
  const [htmlBody, setHtmlBody] = useState(template?.html_body ?? '')

  const previewSubject = renderPreview(subject, prospect)
  const previewHtml = renderPreview(htmlBody, prospect)

  async function handleSend() {
    if (!prospect.email) {
      toast('Este prospecto no tiene email registrado', 'error')
      return
    }
    if (!subject.trim()) {
      toast('El asunto no puede estar vacío', 'error')
      return
    }
    if (!htmlBody.trim()) {
      toast('El cuerpo del correo no puede estar vacío', 'error')
      return
    }

    const { error } = await sendEmail({
      prospect_id: prospect.id,
      template_id: template?.id ?? null,
      custom_subject: previewSubject,
      custom_html: previewHtml,
    })

    if (error) {
      toast('Error al enviar: ' + error, 'error')
    } else {
      toast(`Correo enviado a ${prospect.email} ✓`, 'success')
      onSent?.()
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={14} /> {template ? 'Cambiar plantilla' : 'Volver'}
        </button>
        {template && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{template.name}</span>
        )}
        {!template && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Correo libre</span>
        )}
      </div>

      {/* Para */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs font-medium text-gray-500 w-12">Para:</span>
        <span className="text-sm text-gray-900">
          {prospect.full_name}
          {prospect.email
            ? <span className="text-gray-400 ml-1">{'<'}{prospect.email}{'>'}</span>
            : <span className="text-red-400 ml-1 text-xs">⚠ Sin email registrado</span>
          }
        </span>
      </div>

      {/* Asunto */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Asunto</label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Editar' : 'Preview'}
          </button>
        </div>
        {showPreview ? (
          <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            {previewSubject}
          </div>
        ) : (
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none"
          />
        )}
      </div>

      {/* Cuerpo */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {showPreview ? 'Vista previa del correo' : 'Cuerpo (HTML)'}
        </label>
        {showPreview ? (
          <div
            className="border border-gray-200 rounded-lg p-4 bg-white text-sm min-h-[200px] overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <textarea
            value={htmlBody}
            onChange={(e) => setHtmlBody(e.target.value)}
            rows={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none resize-none"
          />
        )}
        <p className="text-xs text-gray-400 mt-1">
          Variables: <code className="bg-gray-100 px-1 rounded">{'{{full_name}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{company_name}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{city}}'}</code>{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{advisor_name}}'}</code>
        </p>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onBack}>Cancelar</Button>
        <Button onClick={handleSend} disabled={sending || !prospect.email}>
          <Send size={15} />
          {sending ? 'Enviando...' : 'Enviar correo'}
        </Button>
      </div>
    </div>
  )
}
