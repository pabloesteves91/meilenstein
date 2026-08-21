import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
  doc, setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useEntries(childId, user) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childId || !user) { setEntries([]); setLoading(false); return }

    const q = query(
      collection(db, 'entries'),
      where('child_id', '==', childId),
      orderBy('datum', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // hasPendingWrites = not yet synced to server (offline)
        sync_status: d.metadata.hasPendingWrites ? 'pending' : 'synced',
      }))
      setEntries(data)
      setLoading(false)
    }, () => setLoading(false))

    return unsubscribe
  }, [childId, user])

  const addEntry = useCallback(async (data) => {
    if (!user) return
    const id = crypto.randomUUID()
    const entry = {
      child_id: childId,
      titel: data.titel,
      kategorie: data.kategorie,
      datum: data.datum,
      notiz: data.notiz || null,
      foto_url: data.foto_url || null,
      erstellt_von: user.uid,
      erstellt_von_email: user.email || null,
      created_at: serverTimestamp(),
    }
    // setDoc writes immediately to local cache → onSnapshot fires at once (optimistic UI)
    await setDoc(doc(db, 'entries', id), entry)
    return { id, ...entry }
  }, [childId, user])

  const removeEntry = useCallback(async (id) => {
    await deleteDoc(doc(db, 'entries', id))
  }, [])

  return { entries, loading, addEntry, removeEntry }
}
