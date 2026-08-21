import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { BottomNav } from './components/BottomNav'
import { OfflineBanner } from './components/OfflineBanner'
import { LoginPage } from './pages/LoginPage'
import { FinishLoginPage } from './pages/FinishLoginPage'
import { HomePage } from './pages/HomePage'
import { ChildPage } from './pages/ChildPage'
import { AddEntryPage } from './pages/AddEntryPage'
import { InvitePage } from './pages/InvitePage'
import { JoinPage } from './pages/JoinPage'
import { SettingsPage } from './pages/SettingsPage'

const BOTTOM_NAV_PATHS = ['/', '/settings']

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fef8f1' }}>
        <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-on-primary-container ms-fill">child_care</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ user, loading }) {
  const { pathname } = useLocation()
  const showNav = BOTTOM_NAV_PATHS.includes(pathname)

  return (
    <>
      <Routes>
        <Route path="/login" element={user && !loading ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/finish-login" element={<FinishLoginPage />} />
        <Route path="/join/:code" element={<JoinPage user={user} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <HomePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ChildPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id/add-entry"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <AddEntryPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id/invite"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <InvitePage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <SettingsPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {user && !loading && <BottomNav />}
    </>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  return (
    <>
      <OfflineBanner />
      <AppLayout user={user} loading={loading} />
    </>
  )
}
