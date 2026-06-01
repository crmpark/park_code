import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProspectsPage } from './pages/ProspectsPage'
import { ProspectDetailPage } from './pages/ProspectDetailPage'
import { PipelinePage } from './pages/PipelinePage'
import { AdminPage } from './pages/AdminPage'
import { EmailsPage } from './pages/EmailsPage'
import { WhatsAppPage } from './pages/WhatsAppPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Pública */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/crm/login" element={<LoginPage />} />

            {/* CRM protegido bajo /crm */}
            <Route path="/crm" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/crm/prospectos" element={<ProtectedRoute><ProspectsPage /></ProtectedRoute>} />
            <Route path="/crm/prospectos/:id" element={<ProtectedRoute><ProspectDetailPage /></ProtectedRoute>} />
            <Route path="/crm/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
            <Route path="/crm/correos" element={<ProtectedRoute><EmailsPage /></ProtectedRoute>} />
            <Route path="/crm/whatsapp" element={<ProtectedRoute><WhatsAppPage /></ProtectedRoute>} />
            <Route path="/crm/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

            {/* Redirigir rutas viejas */}
            <Route path="/login" element={<Navigate to="/crm/login" replace />} />
            <Route path="/dashboard" element={<Navigate to="/crm" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
