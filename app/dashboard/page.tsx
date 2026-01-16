'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { postsAPI, snapchatAPI, instagramAPI, authAPI } from '@/lib/api';
import { FiFileText, FiCheckCircle, FiClock, FiTrendingUp, FiEye } from 'react-icons/fi';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [snapchatStatus, setSnapchatStatus] = useState<any>(null);
  const [instagramStatus, setInstagramStatus] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [analyticsRes, snapchatRes, instagramRes, userRes] = await Promise.all([
        postsAPI.getAnalytics(),
        snapchatAPI.getStatus(),
        instagramAPI.getStatus(),
        authAPI.getMe(),
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setSnapchatStatus(snapchatRes.data);
      setInstagramStatus(instagramRes.data);
      setUser(userRes.data.user);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const handleConnectInstagram = async () => {
    try {
      const response = await instagramAPI.getAuthURL();
      window.location.href = response.data.authURL;
    } catch (error) {
      console.error('Error getting auth URL:', error);
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

        <div className="container mx-auto p-6">
          {showSuccess && (
            <div className="alert alert-success mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Subscription activated successfully!</span>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-base-content">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg text-base-content/70">Here's what's happening with your content</p>
          </div>

          {(!snapchatStatus?.isConnected || !instagramStatus?.isConnected) && (
            <div className="alert alert-warning mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Connect your social accounts to start publishing</span>
              <div className="flex gap-2">
                {!snapchatStatus?.isConnected && (
                  <button className="btn btn-sm btn-primary" onClick={handleConnectSnapchat}>
                    Connect Snapchat
                  </button>
                )}
                {!instagramStatus?.isConnected && (
                  <button className="btn btn-sm btn-accent" onClick={handleConnectInstagram}>
                    Connect Instagram
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Posts"
              value={analytics?.totalPosts || 0}
              icon={<FiFileText className="w-8 h-8" />}
              description="All time"
            />
            <StatCard
              title="Published"
              value={analytics?.publishedPosts || 0}
              icon={<FiCheckCircle className="w-8 h-8" />}
              description="Successfully published"
            />
            <StatCard
              title="Scheduled"
              value={analytics?.scheduledPosts || 0}
              icon={<FiClock className="w-8 h-8" />}
              description="Upcoming posts"
            />
            <StatCard
              title="Total Views"
              value={analytics?.totalViews || 0}
              icon={<FiEye className="w-8 h-8" />}
              description="Across all posts"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Quick Actions</h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Link href="/posts/new" className="btn btn-primary btn-lg">
                    <FiFileText /> Create New Post
                  </Link>
                  <Link href="/posts" className="btn btn-outline btn-lg">
                    View All Posts
                  </Link>
                  {!snapchatStatus?.isConnected && (
                    <button className="btn btn-accent btn-lg" onClick={handleConnectSnapchat}>
                      Connect Snapchat
                    </button>
                  )}
                  {!instagramStatus?.isConnected && (
                    <button className="btn btn-secondary btn-lg" onClick={handleConnectInstagram}>
                      Connect Instagram
                    </button>
                  )}
                  <Link href="/pricing" className="btn btn-outline btn-lg">
                    Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Your Plan</h2>
                <div className="mt-4">
                  <div className="badge badge-primary badge-lg mb-2">
                    {user?.subscription?.plan?.toUpperCase()}
                  </div>
                  <p className="text-sm text-base-content/70 mb-4">
                    {analytics?.postsThisMonth || 0} / {analytics?.planLimits?.postsPerMonth === -1 ? '∞' : analytics?.planLimits?.postsPerMonth} posts this month
                  </p>
                  {analytics?.planLimits?.postsPerMonth !== -1 && (
                    <progress
                      className="progress progress-primary"
                      value={analytics?.postsThisMonth || 0}
                      max={analytics?.planLimits?.postsPerMonth || 100}
                    ></progress>
                  )}
                  <div className="mt-4">
                    <Link href="/pricing" className="btn btn-sm btn-outline w-full">
                      Upgrade Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl mt-6">
            <div className="card-body">
              <h2 className="card-title">Account Status</h2>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                  <div className={`badge ${snapchatStatus?.isConnected ? 'badge-success' : 'badge-error'}`}>
                    {snapchatStatus?.isConnected ? 'Connected' : 'Not Connected'}
                  </div>
                  <span className="text-base-content">Snapchat Account</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                  <div className={`badge ${instagramStatus?.isConnected ? 'badge-success' : 'badge-error'}`}>
                    {instagramStatus?.isConnected ? 'Connected' : 'Not Connected'}
                  </div>
                  <span className="text-base-content">Instagram Account</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                  <div className={`badge ${user?.subscription?.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {user?.subscription?.status}
                  </div>
                  <span className="text-base-content">Subscription</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ProtectedRoute>
    }>
      <DashboardContent />
    </Suspense>
  );
}
