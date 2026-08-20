import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center text-xs py-1.5 px-4 font-medium">
      Offline – Einträge werden gespeichert und später synchronisiert
    </div>
  )
}
