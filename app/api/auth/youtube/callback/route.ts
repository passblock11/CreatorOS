import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Build redirect URL with params - redirect to client-side page
    const redirectUrl = new URL('/youtube-callback', request.url);
    
    if (error) {
      redirectUrl.searchParams.set('error', error);
    } else if (code) {
      redirectUrl.searchParams.set('code', code);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('YouTube callback redirect error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=' + encodeURIComponent('An error occurred'), request.url)
    );
  }
}
