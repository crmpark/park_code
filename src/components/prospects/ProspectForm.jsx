import { useState } from 'react'
import { Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { SECTORS, PARK_TYPES, LEAD_SOURCES, PIPELINE_STAGES } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'
import { useAdvisors } from '../../hooks/useAdvisors'

export function ProspectForm({ onSubmit, onCancel, initialData = {} }) {
  const { isAdmin } = useAuth()
  const { advisors } = useAdvisors()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    city: '',
    department: '',
    sector: '',
    park_type: '',
    lead_source: '',
    pipeline_stage: 'lead_nuevo',
    estimated_value: '',
    next_contact_date: '',
    notes: '',
    advisor_id: '',
    ...initialData,
  })

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      ...form,
      estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
      next_contact_date: form.next_contact_date || null,
      advisor_id: form.advisor_id || undefined,
    }
    await onSubmit(payload)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre completo *"
          value={form.full_name}
          onChange={(e) => set('full_name', e.target.value)}
          required
        />
        <Input
          label="Empresa / Organización"
          value={form.company_name}
          onChange={(e) => set('company_name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
        <Input
          label="Teléfono / WhatsApp"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="573001234567"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
        />
        <Input
          label="Departamento"
          value={form.department}
          onChange={(e) => set('department', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Sector *"
          value={form.sector}
          onChange={(e) => set('sector', e.target.value)}
          required
        >
          <option value="">Seleccionar sector</option>
          {SECTORS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <Select
          label="Tipo de parque *"
          value={form.park_type}
          onChange={(e) => set('park_type', e.target.value)}
          required
        >
          <option value="">Seleccionar tipo</option>
          {PARK_TYPES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Fuente del lead"
          value={form.lead_source}
          onChange={(e) => set('lead_source', e.target.value)}
        >
          <option value="">Seleccionar fuente</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <Select
          label="Etapa del pipeline"
          value={form.pipeline_stage}
          onChange={(e) => set('pipeline_stage', e.target.value)}
        >
          {PIPELINE_STAGES.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valor estimado (COP)"
          type="number"
          value={form.estimated_value}
          onChange={(e) => set('estimated_value', e.target.value)}
          placeholder="0"
        />
        <Input
          label="Próximo contacto"
          type="date"
          value={form.next_contact_date}
          onChange={(e) => set('next_contact_date', e.target.value)}
        />
      </div>

      {isAdmin && advisors.length > 0 && (
        <Select
          label="Asignar a asesor"
          value={form.advisor_id}
          onChange={(e) => set('advisor_id', e.target.value)}
        >
          <option value="">Asignar a mí mismo</option>
          {advisors.map((a) => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </Select>
      )}

      <Textarea
        label="Notas / Descripción del proyecto"
        value={form.notes}
        onChange={(e) => set('notes', e.target.value)}
        rows={3}
        placeholder="Detalles del proyecto, área, requisitos especiales..."
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData.id ? 'Actualizar' : 'Crear prospecto'}
        </Button>
      </div>
    </form>
  )
}
