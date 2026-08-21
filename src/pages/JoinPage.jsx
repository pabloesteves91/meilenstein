import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  collection, query, where, getDocs,
  doc, setDoc, updateDoc, arrayUnion,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function JoinPage({ user }) {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [childName, setChildName] = useState('')
  const [childId, setChildId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('pendingJoinCode', code)
      navigate('/login')
      return
    }
    joinWithCode()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, code])

  const joinWithCode = async () => {
    setStatus('loading')
    try {
      // Find the invite by code
      const inviteSnap = await getDocs(
        query(collection(db, 'invites'), where('code', '==', code))
      )

      if (inviteSnap.empty) {
        setError('Einladungslink nicht gefunden.')
        setStatus('error')
        return
      }

      const inviteDoc = inviteSnap.docs[0]
      const invite = inviteDoc.data()

      // Check expiry
      const gueltigBis = invite.gueltig_bis?.toDate?.() || new Date(invite.gueltig_bis)
      if (gueltigBis < new Date()) {
        setError('Dieser Einladungslink ist abgelaufen.')
        setStatus('error')
        return
      }

      const cId = invite.child_id

      // Fetch child name
      const childSnap = await getDocs(
        query(collection(db, 'children'), where('__name__', '==', cId))
      )
      const child = childSnap.docs[0]?.data()
      setChildName(child?.name || '')
      setChildId(cId)

      // Add user to members array (idempotent with arrayUnion)
      await updateDoc(doc(db, 'children', cId), {
        members: arrayUnion(user.uid),
      })

      setStatus('success')
      setTimeout(() => navigate(`/child/${cId}`), 2000)
    } catch (e) {
      setError('Beitritt fehlgeschlagen: ' + e.message)
      setStatus('error')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-container-margin relative overflow-hidden"
      style={{ background: '#fef8f1' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #ffdab9 0%, #bbebf1 100%)', opacity: 0.15 }}
      />

      <main className="w-full max-w-md flex flex-col items-center text-center space-y-xl z-10">
        {status === 'loading' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: 'linear-gradient(135deg, #ffdab9, #bbebf1)' }} />
              <div className="relative w-32 h-32 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-lowest shadow-soft-lg">
                <span className="material-symbols-outlined text-6xl ms-fill text-on-primary-container animate-spin">star</span>
              </div>
            </div>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Einladung wird verarbeitet…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="space-y-sm">
              <h1 className="text-display-lg font-display-lg text-primary">Willkommen!</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[280px] mx-auto">
                Du wurdest eingeladen, dem Profil von{' '}
                <strong className="text-primary">{childName}</strong> beizutreten!
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: 'linear-gradient(135deg, #ffdab9, #bbebf1)' }} />
              <div className="relative w-48 h-48 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-lowest shadow-soft-lg z-10">
                <span className="material-symbols-outlined text-7xl ms-fill text-on-primary-container">child_care</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-surface-container-lowest rounded-full p-2 shadow-soft z-20 w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary ms-fill">check_circle</span>
              </div>
            </div>
            <button
              onClick={() => navigate(childId ? `/child/${childId}` : '/')}
              className="w-full max-w-[280px] text-on-primary rounded-full py-4 px-6 text-headline-sm font-headline-sm shadow-soft hover:opacity-90 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #74593f, #8a6a4c)' }}
            >
              Jetzt anzeigen
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="material-symbols-outlined text-6xl text-error block">error</span>
            <p className="text-body-lg font-body-lg text-error">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition py-2"
            >
              Zurück zur Startseite
            </button>
          </>
        )}
      </main>
    </div>
  )
}
