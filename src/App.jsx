import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { BottomNav } from './components/BottomNav'
import { OfflineBanner } from './components/OfflineBanner'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { ChildPage } from './pages/ChildPage'
import { AddEntryPage } from './pages/AddEntryPage'
import { InvitePage } from './pages/InvitePage'
import { JoinPage } from './pages/JoinPage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-4xl animate-pulse">⭐</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()

  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route path="/login" element={user && !loading ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/join/:code" element={<JoinPage user={user} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <HomePage user={user} />
              <BottomNav />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child/:id"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ChildPage user={user} />
              <BottomNav />
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
              <BottomNav />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
