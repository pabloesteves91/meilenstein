export function SyncDot({ status }) {
  if (status === 'synced') {
    return (
      <div
        className="absolute top-md right-md w-2 h-2 rounded-full bg-tertiary"
        style={{ boxShadow: '0 0 8px rgba(0,116,34,0.4)' }}
        title="Synchronisiert"
      />
    )
  }
  return (
    <div
      className="absolute top-md right-md w-2 h-2 rounded-full bg-outline animate-pulse"
      title="Wartet auf Synchronisation"
    />
  )
}
