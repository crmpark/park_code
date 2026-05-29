import { useState } from 'react'
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAdvisors } from '../hooks/useAdvisors'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import { formatDate } from '../lib/utils'

export function AdminPage() {
  const toast = useToast()
  const { advisors, loading, createAdvisor, updateAdvisor } = useAdvisors()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Administración"
          actions={
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} /> Nuevo asesor
            </Button>
          }
        />
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Asesores comerciales</h3>
              <p className="text-sm text-gray-400">Gestiona el equipo de ventas</p>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Nombre</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Teléfono</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Rol</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Estado</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Desde</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {advisors.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#52B788] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {a.full_name?.[0]?.toUpperCase()}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{a.full_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{a.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{a.phone ?? '—'}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {a.role === 'admin' ? 'Administrador' : 'Asesor'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={async () => {
                            const { error } = await updateAdvisor(a.id, { active: !a.active })
                            if (error) toast('Error al actualizar', 'error')
                            else toast(`Asesor ${a.active ? 'desactivado' : 'activado'}`, 'success')
                          }}
                          className={`flex items-center gap-1.5 text-xs font-medium ${a.active ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {a.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          {a.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{formatDate(a.created_at)}</td>
                      <td className="px-4 py-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {advisors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No hay asesores registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nuevo asesor" size="sm">
        <AdvisorForm
          onSubmit={async (data) => {
            const { error } = await createAdvisor(data.email, data.password, data.full_name, data.phone)
            if (error) toast('Error: ' + (error.message ?? 'No se pudo crear el asesor'), 'error')
            else {
              toast('Asesor creado exitosamente', 'success')
              setShowForm(false)
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function AdvisorForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
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
      <Input label="Nombre completo *" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} required />
      <Input label="Correo electrónico *" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
      <Input label="Teléfono" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="573001234567" />
      <Input label="Contraseña temporal *" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required />
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Creando...' : 'Crear asesor'}</Button>
      </div>
    </form>
  )
}
