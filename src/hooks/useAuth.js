import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const ACTION_CODE_SETTINGS = {
  url: `${window.location.origin}${import.meta.env.BASE_URL}finish-login`,
  handleCodeInApp: true,
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const sendMagicLink = async (email) => {
    try {
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS)
      window.localStorage.setItem('emailForSignIn', email)
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return { user, loading, sendMagicLink, signOut }
}

// Call on /finish-login route to complete the sign-in
export async function completeEmailLinkSignIn() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null
  const email = window.localStorage.getItem('emailForSignIn')
    || window.prompt('Bitte E-Mail-Adresse zur Bestätigung eingeben:')
  if (!email) return null
  const result = await signInWithEmailLink(auth, email, window.location.href)
  window.localStorage.removeItem('emailForSignIn')
  return result.user
}
