import { supabase } from './supabase'
import {
  getPendingEntries,
  updateLocalEntrySync,
  bulkSaveChildren,
  bulkSaveEntries,
} from './db'

export async function syncPendingEntries() {
  const pending = await getPendingEntries()
  if (!pending.length) return { synced: 0, failed: 0 }

  let synced = 0
  let failed = 0

  for (const entry of pending) {
    const { sync_status, ...data } = entry
    try {
      const { error } = await supabase
        .from('entries')
        .upsert(data, { onConflict: 'id' })

      if (error) throw error
      await updateLocalEntrySync(entry.id)
      synced++
    } catch {
      failed++
    }
  }

  return { synced, failed }
}

export async function fetchAndCacheChildren(userId) {
  // Fetch children the user is owner or member of
  const { data: memberships } = await supabase
    .from('child_members')
    .select('child_id')
    .eq('user_id', userId)

  if (!memberships?.length) return []

  const childIds = memberships.map(m => m.child_id)
  const { data: children } = await supabase
    .from('children')
    .select('*')
    .in('id', childIds)

  if (children?.length) await bulkSaveChildren(children)
  return children || []
}

export async function fetchAndCacheEntries(childId) {
  const { data: entries } = await supabase
    .from('entries')
    .select('*, profiles(display_name)')
    .eq('child_id', childId)
    .order('datum', { ascending: false })

  if (entries?.length) await bulkSaveEntries(entries)
  return entries || []
}
