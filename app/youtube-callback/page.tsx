'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function YouTubeCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('YouTube OAuth error:', error);
        router.push(`/settings?error=${encodeURIComponent('YouTube connection failed')}`);
        return;
      }

      if (!code) {
        router.push('/settings?error=' + encodeURIComponent('No authorization code received'));
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login?error=' + encodeURIComponent('Please log in first'));
        return;
      }

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004/api';
        const response = await axios.get(`${API_URL}/youtube/callback?code=${code}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          router.push('/settings?success=' + encodeURIComponent('YouTube connected successfully!'));
        } else {
          router.push(`/settings?error=${encodeURIComponent(response.data.message || 'Failed to connect YouTube')}`);
        }
      } catch (err: any) {
        console.error('YouTube callback error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to connect YouTube account';
        router.push(`/settings?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-lg">Connecting your YouTube account...</p>
      </div>
    </div>
  );
}

export default function YouTubeCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    }>
      <YouTubeCallbackContent />
    </Suspense>
  );
}
