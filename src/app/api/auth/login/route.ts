
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { z } from 'zod'

// Input validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required').max(256, 'Password too long'),
})

export async function POST(request: Request) {
  try {
    // Parse and validate input
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Use Supabase native authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Authentication error:', error.message)
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { message: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Get user role from profiles table or user_metadata
    let userRole = 'admin' // Default role
    
    // For demo user, always admin
    if (data.user.email === 'demo@example.com') {
      userRole = 'admin'
    } else {
      // Try to get from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      if (profileData?.role) {
        userRole = profileData.role
      } else if (data.user.user_metadata?.role) {
        userRole = data.user.user_metadata.role
      }
    }

    // Create safe user object
    const safeUser = {
      id: data.user.id,
      email: data.user.email,
      role: userRole,
      created_at: data.user.created_at,
    }

    console.log('✅ User authenticated:', safeUser.email, 'Role:', userRole)

    // Create response with HttpOnly cookies
    const response = NextResponse.json({ 
      user: safeUser,
      success: true
    })

    // Set HttpOnly, Secure, SameSite cookies
    response.cookies.set({
      name: 'auth_token',
      value: data.session.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    response.cookies.set({
      name: 'refresh_token',
      value: data.session.refresh_token || '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // CSRF token
    const csrfToken = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex')
    response.cookies.set({
      name: 'csrf_token',
      value: csrfToken,
      httpOnly: false, // Allow JS to read for sending in headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Authentication service error' },
      { status: 500 }
    )
  }
}
