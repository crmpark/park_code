import { useState } from 'react'
import { Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { ACTIVITY_TYPES } from '../../lib/constants'

export function ActivityForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    activity_type: 'call',
    title: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Tipo de actividad" value={form.activity_type} onChange={(e) => set('activity_type', e.target.value)}>
        {ACTIVITY_TYPES.filter(t => t.value !== 'stage_change').map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>
      <Input label="Título / Resumen *" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      <Textarea label="Descripción" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} />
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Registrar'}</Button>
      </div>
    </form>
  )
}
