import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { syncPendingEntries } from '../lib/sync'
import { useState } from 'react'

export function SettingsPage({ user }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    const result = await syncPendingEntries()
    setSyncResult(result)
    setSyncing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Konto & Einstellungen</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* User info */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Eingeloggt als</p>
          <p className="text-gray-900 font-medium">{user?.email}</p>
        </div>

        {/* Online status + sync */}
        <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Verbindungsstatus</span>
            <span className={`flex items-center gap-1.5 text-sm font-medium ${isOnline ? 'text-emerald-600' : 'text-amber-500'}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {syncing ? 'Synchronisiere…' : 'Jetzt synchronisieren'}
          </button>
          {syncResult && (
            <p className="text-xs text-gray-500 text-center">
              {syncResult.synced} synchronisiert · {syncResult.failed} fehlgeschlagen
            </p>
          )}
        </div>

        {/* PWA install hint */}
        <div className="bg-brand-50 rounded-2xl p-5">
          <h3 className="font-semibold text-brand-900 mb-1">App installieren</h3>
          <p className="text-brand-700 text-sm leading-relaxed">
            Auf iOS: Tippe auf <strong>Teilen</strong> → <strong>Zum Home-Bildschirm</strong> für die beste Erfahrung ohne Browser-UI.
          </p>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-2xl bg-white shadow-card text-red-500 font-semibold text-sm hover:bg-red-50 transition"
        >
          Abmelden
        </button>
      </div>
    </div>
  )
}
