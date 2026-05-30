import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProspectsPage } from './pages/ProspectsPage'
import { ProspectDetailPage } from './pages/ProspectDetailPage'
import { PipelinePage } from './pages/PipelinePage'
import { AdminPage } from './pages/AdminPage'
import { EmailsPage } from './pages/EmailsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/prospectos" element={<ProtectedRoute><ProspectsPage /></ProtectedRoute>} />
            <Route path="/prospectos/:id" element={<ProtectedRoute><ProspectDetailPage /></ProtectedRoute>} />
            <Route path="/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
            <Route path="/correos" element={<ProtectedRoute><EmailsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
