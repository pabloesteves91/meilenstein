import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLocalEntries, saveLocalEntry, deleteLocalEntry } from '../lib/db'
import { fetchAndCacheEntries, syncPendingEntries } from '../lib/sync'

export function useEntries(childId, user) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!childId) { setEntries([]); setLoading(false); return }
    const local = await getLocalEntries(childId)
    if (local.length) setEntries(local)

    try {
      const remote = await fetchAndCacheEntries(childId)
      setEntries(remote)
    } catch {
      // stay with local
    }
    setLoading(false)
  }, [childId])

  useEffect(() => { load() }, [load])

  // Auto-sync when online
  useEffect(() => {
    const handleOnline = async () => {
      await syncPendingEntries()
      await load()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [load])

  const addEntry = async (data) => {
    const entry = {
      id: crypto.randomUUID(),
      child_id: childId,
      titel: data.titel,
      kategorie: data.kategorie,
      datum: data.datum,
      notiz: data.notiz || null,
      foto_url: data.foto_url || null,
      erstellt_von: user.id,
      sync_status: 'pending',
    }

    // Optimistic update
    await saveLocalEntry(entry)
    setEntries(prev => [entry, ...prev].sort((a, b) => new Date(b.datum) - new Date(a.datum)))

    if (navigator.onLine) {
      try {
        const { sync_status, ...dbData } = entry
        const { error } = await supabase.from('entries').insert(dbData)
        if (!error) {
          const updated = { ...entry, sync_status: 'synced' }
          await saveLocalEntry(updated)
          setEntries(prev => prev.map(e => e.id === entry.id ? updated : e))
        }
      } catch {
        // stays pending
      }
    }

    return entry
  }

  const removeEntry = async (id) => {
    await deleteLocalEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
    try {
      await supabase.from('entries').delete().eq('id', id)
    } catch (e) {
      console.error('Remove entry sync failed', e)
    }
  }

  return { entries, loading, addEntry, removeEntry, refresh: load }
}
