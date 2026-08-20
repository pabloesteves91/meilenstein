import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-surface-variant text-on-surface-variant text-center text-caption font-caption py-1.5 px-4 flex items-center justify-center gap-1">
      <span className="material-symbols-outlined text-[14px]">cloud_off</span>
      Offline – Einträge werden später synchronisiert
    </div>
  )
}
