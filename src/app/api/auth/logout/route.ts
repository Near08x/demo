import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    })

    // Clear all auth-related cookies
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      maxAge: 0,
      path: '/',
    })

    response.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      maxAge: 0,
      path: '/',
    })

    response.cookies.set({
      name: 'csrf_token',
      value: '',
      httpOnly: false,
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    )
  }
}
