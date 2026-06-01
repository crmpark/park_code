import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { TreePine, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const { user, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) return <Navigate to="/crm" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    if (error) setError('Correo o contraseña incorrectos.')
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#F0F4F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center">
              <TreePine size={22} className="text-[#52B788]" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">Parques CMR</p>
              <p className="text-gray-400 text-xs">BParkLife · SoluParques · Aquarela</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-1">Bienvenida</h2>
          <p className="text-gray-500 text-sm mb-6">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          ¿Problemas para acceder? Contacta al administrador.
        </p>
      </div>
    </div>
  )
}
