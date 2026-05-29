import { createClient } from '@supabase/supabase-js'

const isBrowser = typeof window !== 'undefined'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'implicit',
      persistSession: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          if (isBrowser) {
            try {
              return window.localStorage.getItem(key)
            } catch (e) {
              console.error('localStorage.getItem error:', e)
            }
          }
          return null
        },
        setItem: (key, value) => {
          if (isBrowser) {
            try {
              window.localStorage.setItem(key, value)
            } catch (e) {
              console.error('localStorage.setItem error:', e)
            }
          }
        },
        removeItem: (key) => {
          if (isBrowser) {
            try {
              window.localStorage.removeItem(key)
            } catch (e) {
              console.error('localStorage.removeItem error:', e)
            }
          }
        }
      }
    }
  }
)