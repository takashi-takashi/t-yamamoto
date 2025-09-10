import { initializeApp, type FirebaseOptions, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  if (process.server) return { provide: { firebase: null } }

  const config = useRuntimeConfig().public
  const options: FirebaseOptions = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId,
  }

  const app = getApps().length ? getApps()[0]! : initializeApp(options)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  async function loginWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function logout() { await signOut(auth) }

  function onAuth(cb: (u: User|null) => void) { return onAuthStateChanged(auth, cb) }

  return {
    provide: {
      firebase: { app, auth, db, storage, loginWithGoogle, logout, onAuth },
    },
  }
})

