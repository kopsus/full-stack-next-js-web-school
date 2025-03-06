"use server"

import 'server-only'
import { SignJWT, jwtVerify } from 'jose'


type SessionPayload = {
    id: string;
    role: string;
    expiresAt: Date;
}
 
const secretKey = process.env.JWT_SECRET
if (!secretKey) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  if (!session) {
    console.log('No session provided')
    return null
  }
  
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session:', error)
    return null
  }
}