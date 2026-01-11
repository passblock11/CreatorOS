import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    console.error('Missing code or state in Snapchat callback');
    return NextResponse.redirect(new URL('/settings?snapchat=error&message=missing_params', request.url));
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const callbackUrl = `${backendUrl}/api/snapchat/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;

    console.log('Calling backend callback:', callbackUrl);

    const response = await fetch(callbackUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return NextResponse.redirect(new URL('/settings?snapchat=connected', request.url));
    } else {
      return NextResponse.redirect(new URL('/settings?snapchat=error&message=' + encodeURIComponent(data.message || 'Connection failed'), request.url));
    }
  } catch (error) {
    console.error('Snapchat callback error:', error);
    return NextResponse.redirect(new URL('/settings?snapchat=error&message=server_error', request.url));
  }
}
