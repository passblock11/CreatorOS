'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { authAPI, snapchatAPI, instagramAPI, stripeAPI } from '@/lib/api';
import { FiUser, FiCreditCard, FiLink } from 'react-icons/fi';

function SettingsContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [snapchatStatus, setSnapchatStatus] = useState<any>(null);
  const [instagramStatus, setInstagramStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const snapchatParam = searchParams.get('snapchat');
    const instagramParam = searchParams.get('instagram');
    const messageParam = searchParams.get('message');
    
    if (snapchatParam === 'connected' || snapchatParam === 'success') {
      setSuccess('Snapchat account connected successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } else if (snapchatParam === 'error') {
      setError(`Failed to connect Snapchat: ${messageParam || 'Unknown error'}`);
      setTimeout(() => setError(''), 5000);
    }
    
    if (instagramParam === 'success') {
      setSuccess('Instagram account connected successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } else if (instagramParam === 'error') {
      setError(`Failed to connect Instagram: ${messageParam || 'Unknown error'}`);
      setTimeout(() => setError(''), 5000);
    }
    
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [userRes, snapchatRes, instagramRes] = await Promise.all([
        authAPI.getMe(),
        snapchatAPI.getStatus(),
        instagramAPI.getStatus(),
      ]);

      setUser(userRes.data.user);
      setName(userRes.data.user.name);
      setSnapchatStatus(snapchatRes.data);
      setInstagramStatus(instagramRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      await authAPI.updateProfile({ name });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleConnectSnapchat = async () => {
    try {
      const response = await snapchatAPI.getAuthURL();
      window.location.href = response.data.authURL;
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  const handleDisconnectSnapchat = async () => {
    try {
      await snapchatAPI.disconnect();
      setSnapchatStatus({ isConnected: false });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleConnectInstagram = async () => {
    try {
      const response = await instagramAPI.getAuthURL();
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  const handleDisconnectInstagram = async () => {
    try {
      await instagramAPI.disconnect();
      setInstagramStatus({ isConnected: false });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await stripeAPI.createPortalSession();
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="container mx-auto p-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

          {success && (
            <div className="alert alert-success mb-6">
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <FiUser /> Profile Information
                </h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={user?.email}
                      disabled
                    />
                    <label className="label">
                      <span className="label-text-alt">Email cannot be changed</span>
                    </label>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary ${updating ? 'btn-disabled' : ''}`}
                      disabled={updating}
                    >
                      {updating ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <FiLink /> Social Media Integrations
                </h2>
                
                {/* Snapchat */}
                <div className="flex items-center justify-between py-3 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-2xl">
                      👻
                    </div>
                    <div>
                      <p className="font-semibold">Snapchat</p>
                      <p className="text-sm opacity-70">
                        {snapchatStatus?.isConnected
                          ? 'Connected'
                          : 'Connect your Snapchat account'}
                      </p>
                    </div>
                  </div>
                  {snapchatStatus?.isConnected ? (
                    <button className="btn btn-error btn-sm btn-outline" onClick={handleDisconnectSnapchat}>
                      Disconnect
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={handleConnectSnapchat}>
                      Connect
                    </button>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div>
                      <p className="font-semibold">Instagram</p>
                      <p className="text-sm opacity-70">
                        {instagramStatus?.isConnected
                          ? `@${instagramStatus.account?.username} - ${instagramStatus.account?.pageName}`
                          : 'Connect your Instagram Business account'}
                      </p>
                    </div>
                  </div>
                  {instagramStatus?.isConnected ? (
                    <button className="btn btn-error btn-sm btn-outline" onClick={handleDisconnectInstagram}>
                      Disconnect
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={handleConnectInstagram}>
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <FiCreditCard /> Subscription
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      Current Plan:{' '}
                      <span className="badge badge-primary">
                        {user?.subscription?.plan?.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm opacity-70 mt-1">
                      Status: {user?.subscription?.status}
                    </p>
                  </div>
                  <button className="btn btn-outline" onClick={handleManageSubscription}>
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ProtectedRoute>
    }>
      <SettingsContent />
    </Suspense>
  );
}
