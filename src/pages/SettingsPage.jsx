import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function SettingsPage({ user }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: '#fef8f1' }}>
      <div className="px-container-margin pt-14 pb-lg">
        <h1 className="text-display-lg font-display-lg text-primary">Profil</h1>
      </div>

      <div className="px-container-margin space-y-sm max-w-lg mx-auto">
        {/* User info */}
        <div className="bg-surface-container-lowest rounded-xl shadow-soft p-md flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container ms-fill">person</span>
          </div>
          <div>
            <p className="text-caption font-caption text-on-surface-variant">Eingeloggt als</p>
            <p className="text-body-md font-body-md text-on-surface font-semibold">{user?.email}</p>
          </div>
        </div>

        {/* Online status */}
        <div className="bg-surface-container-lowest rounded-xl shadow-soft p-md flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-on-surface-variant">sync</span>
            <span className="text-body-md font-body-md text-on-surface">Synchronisation</span>
          </div>
          <span className={`flex items-center gap-1 text-label-sm font-label-sm ${isOnline ? 'text-tertiary' : 'text-outline'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-tertiary' : 'bg-outline animate-pulse'}`} />
            {isOnline ? 'Automatisch aktiv' : 'Offline – wird synchronisiert sobald online'}
          </span>
        </div>

        {/* PWA install */}
        <div className="bg-primary-container/30 rounded-xl p-md flex gap-sm">
          <span className="material-symbols-outlined text-primary shrink-0 mt-0.5 ms-fill">install_mobile</span>
          <div>
            <p className="text-label-sm font-label-sm text-primary mb-1">App installieren</p>
            <p className="text-body-md font-body-md text-on-surface-variant">
              iOS: Tippe auf <strong>Teilen</strong> → <strong>Zum Home-Bildschirm</strong> für die beste Erfahrung.
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-full bg-surface-container-lowest shadow-soft text-label-sm font-label-sm text-error hover:bg-error-container transition flex items-center justify-center gap-sm"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Abmelden
        </button>
      </div>
    </div>
  )
}
