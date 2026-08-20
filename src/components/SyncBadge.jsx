export function SyncBadge({ status }) {
  if (status === 'synced') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Sync
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-500">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
      Ausstehend
    </span>
  )
}
