import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLocalChildren, saveLocalChild, deleteLocalChild } from '../lib/db'
import { fetchAndCacheChildren } from '../lib/sync'

export function useChildren(user) {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) { setChildren([]); setLoading(false); return }
    // Load from local cache first
    const local = await getLocalChildren()
    if (local.length) setChildren(local)

    // Then sync from Supabase
    try {
      const remote = await fetchAndCacheChildren(user.id)
      setChildren(remote)
    } catch {
      // stay with local data
    }
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const addChild = async (data) => {
    const child = {
      id: crypto.randomUUID(),
      name: data.name,
      geburtsdatum: data.geburtsdatum,
      foto_url: data.foto_url || null,
      owner_id: user.id,
    }

    await saveLocalChild(child)
    setChildren(prev => [...prev, child])

    try {
      const { error: childErr } = await supabase.from('children').insert(child)
      if (childErr) throw childErr

      const member = { id: crypto.randomUUID(), child_id: child.id, user_id: user.id, rolle: 'owner' }
      await supabase.from('child_members').insert(member)
    } catch (e) {
      console.error('Sync failed for new child', e)
    }

    return child
  }

  const removeChild = async (id) => {
    await deleteLocalChild(id)
    setChildren(prev => prev.filter(c => c.id !== id))
    try {
      await supabase.from('children').delete().eq('id', id)
    } catch (e) {
      console.error('Remove child sync failed', e)
    }
  }

  return { children, loading, addChild, removeChild, refresh: load }
}
