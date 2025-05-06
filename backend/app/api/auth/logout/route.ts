import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' })

  res.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    expires: new Date(0), // Expire immediately
  })
  return res
}
