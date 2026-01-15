import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from HttpOnly cookie
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(authToken)

    if (error || !data.user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user role from profiles table
    let userRole = 'admin'
    
    if (data.user.email === 'demo@example.com') {
      userRole = 'admin'
    } else {
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

    const safeUser = {
      id: data.user.id,
      email: data.user.email,
      role: userRole,
      created_at: data.user.created_at,
    }

    return NextResponse.json({
      user: safeUser,
      role: userRole,
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { message: 'Session verification failed' },
      { status: 401 }
    )
  }
}
