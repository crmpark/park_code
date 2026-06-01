import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F0]">
        <div className="w-8 h-8 border-4 border-[#52B788] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/crm/login" replace />
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/crm" replace />

  return children
}
