import type { User } from 'firebase/auth'

export const useAuthState = () => {
  const { $firebase } = useNuxtApp() as any
  const user = useState<User | null>('auth:user', () => null)
  if (process.client && $firebase) {
    $firebase.onAuth((u: User | null) => { user.value = u })
  }
  return {
    user,
    login: () => $firebase?.loginWithGoogle(),
    logout: () => $firebase?.logout(),
  }
}

