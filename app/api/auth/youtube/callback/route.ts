import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Check for errors
    if (error) {
      console.error('YouTube OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent('YouTube connection failed')}`, request.url)
      );
    }

    // Check for code
    if (!code) {
      return NextResponse.redirect(
        new URL('/settings?error=' + encodeURIComponent('No authorization code received'), request.url)
      );
    }

    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=' + encodeURIComponent('Please log in first'), request.url)
      );
    }

    // Exchange code for tokens
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004/api';
    const response = await fetch(`${API_URL}/youtube/callback?code=${code}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('YouTube callback error:', data);
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(data.message || 'Failed to connect YouTube')}`, request.url)
      );
    }

    // Success! Redirect to settings
    return NextResponse.redirect(
      new URL('/settings?success=' + encodeURIComponent('YouTube connected successfully!'), request.url)
    );
  } catch (error: any) {
    console.error('YouTube callback error:', error);
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent('An error occurred')}`, request.url)
    );
  }
}
