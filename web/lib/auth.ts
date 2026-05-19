import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SECRET = process.env.JWT_SECRET
if (!SECRET) throw new Error('JWT_SECRET environment variable is not set')

export function signToken(payload: { id: number; email: string; role: string }) {
  return jwt.sign(payload, SECRET!, { expiresIn: '30d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET!) as { id: number; email: string; role: string }
}

export function getTokenFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

export function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) throw new Error('Unauthorized')
  try {
    return verifyToken(token)
  } catch {
    throw new Error('Unauthorized')
  }
}
