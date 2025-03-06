import 'server-only'
import { cookies } from 'next/headers'
import { encrypt } from './session'
 
export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ id: userId, role: role, expiresAt: expiresAt })
    
  const cookieStore = cookies().set('session', session)
console.log(cookieStore)

  return session
}
