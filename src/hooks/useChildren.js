import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, where, onSnapshot,
  doc, setDoc, deleteDoc, serverTimestamp, arrayUnion, arrayRemove,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useChildren(user) {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setChildren([]); setLoading(false); return }

    // Query children where user is in the members array
    const q = query(
      collection(db, 'children'),
      where('members', 'array-contains', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setChildren(data)
      setLoading(false)
    }, () => setLoading(false))

    return unsubscribe
  }, [user])

  const addChild = useCallback(async (data) => {
    if (!user) return
    const id = crypto.randomUUID()
    const child = {
      name: data.name,
      geburtsdatum: data.geburtsdatum,
      foto_url: data.foto_url || null,
      owner_id: user.uid,
      members: [user.uid],
      created_at: serverTimestamp(),
    }
    await setDoc(doc(db, 'children', id), child)
    return { id, ...child }
  }, [user])

  const removeChild = useCallback(async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'children', id))
  }, [user])

  const removeMember = useCallback(async (childId, userId) => {
    await setDoc(doc(db, 'children', childId), { members: arrayRemove(userId) }, { merge: true })
  }, [])

  return { children, loading, addChild, removeChild, removeMember }
}
