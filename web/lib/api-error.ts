import { NextResponse } from 'next/server'

export function apiError(message: string, status: number = 500) {
  return NextResponse.json({ message }, { status })
}

export function handleRouteError(e: unknown): NextResponse {
  if (e instanceof Error) {
    if (e.message === 'Unauthorized') return apiError('Unauthorized', 401)
  }
  // Never expose internal error details to the client
  console.error(e)
  return apiError('Server error', 500)
}
