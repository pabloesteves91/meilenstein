import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function JoinPage({ user }) {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [childName, setChildName] = useState('')
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

    const { data: invite, error: invErr } = await supabase
      .from('invites')
      .select('*, children(name)')
      .eq('code', code)
      .gt('gueltig_bis', new Date().toISOString())
      .single()

    if (invErr || !invite) {
      setError('Einladungslink ungültig oder abgelaufen.')
      setStatus('error')
      return
    }

    setChildName(invite.children?.name || '')

    const { data: existing } = await supabase
      .from('child_members')
      .select('id')
      .eq('child_id', invite.child_id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      const { error: memberErr } = await supabase
        .from('child_members')
        .insert({ id: crypto.randomUUID(), child_id: invite.child_id, user_id: user.id, rolle: 'member' })

      if (memberErr) {
        setError('Beitritt fehlgeschlagen: ' + memberErr.message)
        setStatus('error')
        return
      }
    }

    setStatus('success')
    setTimeout(() => navigate(`/child/${invite.child_id}`), 2000)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-container-margin relative overflow-hidden"
      style={{ background: '#fef8f1' }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #ffdab9 0%, #bbebf1 100%)', opacity: 0.15 }}
      />

      <main className="w-full max-w-md flex flex-col items-center text-center space-y-xl z-10">
        {status === 'loading' && (
          <>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{ background: 'linear-gradient(135deg, #ffdab9, #bbebf1)' }}
              />
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
                Du wurdest eingeladen, dem Profil von <strong className="text-primary">{childName}</strong> beizutreten!
              </p>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{ background: 'linear-gradient(135deg, #ffdab9, #bbebf1)' }}
              />
              <div className="relative w-48 h-48 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-lowest shadow-soft-lg z-10">
                <span className="material-symbols-outlined text-7xl ms-fill text-on-primary-container">child_care</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-surface-container-lowest rounded-full p-2 shadow-soft z-20 w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary ms-fill">check_circle</span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center space-y-md pt-lg">
              <button
                onClick={() => navigate('/')}
                className="w-full max-w-[280px] text-on-primary rounded-full py-4 px-6 text-headline-sm font-headline-sm shadow-soft hover:opacity-90 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #74593f, #8a6a4c)' }}
              >
                Jetzt anzeigen
              </button>
            </div>
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
