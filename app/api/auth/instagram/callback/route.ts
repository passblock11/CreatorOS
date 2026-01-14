import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Build backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const callbackUrl = new URL(`${backendUrl}/instagram/callback`);
  
  // Forward all query parameters
  if (code) callbackUrl.searchParams.set('code', code);
  if (state) callbackUrl.searchParams.set('state', state);
  if (error) callbackUrl.searchParams.set('error', error);
  if (errorDescription) callbackUrl.searchParams.set('error_description', errorDescription);

  try {
    // Forward to backend
    const response = await fetch(callbackUrl.toString(), {
      redirect: 'manual'
    });

    // Backend will redirect to settings page with success/error params
    const location = response.headers.get('location');
    
    if (location) {
      return NextResponse.redirect(location);
    }

    // Fallback redirect
    return NextResponse.redirect(new URL('/settings?instagram=error&message=Callback failed', request.url));
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.redirect(new URL('/settings?instagram=error&message=Callback error', request.url));
  }
}
