import { NextResponse } from 'next/server'
import { corsOptionsResponse, corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsOptionsResponse();
}

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })

  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    expires: new Date(0), // Expire immediately
  })
  
  // Add CORS headers to the response
  return corsHeaders(response)
}
