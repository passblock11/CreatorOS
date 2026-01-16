'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { postsAPI, snapchatAPI, instagramAPI, authAPI } from '@/lib/api';
import { FiFileText, FiCheckCircle, FiClock, FiTrendingUp, FiEye, FiInstagram } from 'react-icons/fi';
import { FaSnapchat } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <Navbar />

        <div className="container mx-auto p-6">
          {showSuccess && (
            <div className="alert alert-success mb-6 shadow-lg animate-pulse">
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
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg opacity-70">Here's what's happening with your content</p>
          </div>

          {(!snapchatStatus?.isConnected || !instagramStatus?.isConnected) && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {!snapchatStatus?.isConnected && (
                <div className="alert alert-warning shadow-lg">
                  <div className="flex items-center gap-3">
                    <FaSnapchat className="w-6 h-6" />
                    <div className="flex-1">
                      <h3 className="font-bold">Snapchat Not Connected</h3>
                      <div className="text-xs">Connect to publish on Snapchat</div>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={handleConnectSnapchat}>
                    Connect Now
                  </button>
                </div>
              )}
              {!instagramStatus?.isConnected && (
                <div className="alert shadow-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/50">
                  <div className="flex items-center gap-3">
                    <FiInstagram className="w-6 h-6 text-pink-500" />
                    <div className="flex-1">
                      <h3 className="font-bold">Instagram Not Connected</h3>
                      <div className="text-xs">Connect to publish on Instagram</div>
                    </div>
                  </div>
                  <button className="btn btn-sm bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white" onClick={handleConnectInstagram}>
                    Connect Now
                  </button>
                </div>
              )}
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
            <div className="lg:col-span-2 card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  <FiTrendingUp className="w-6 h-6" />
                  Quick Actions
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/posts/new" className="btn btn-primary btn-lg hover:scale-105 transition-transform">
                    <FiFileText className="w-5 h-5" /> Create New Post
                  </Link>
                  <Link href="/posts" className="btn btn-outline btn-lg hover:scale-105 transition-transform">
                    <FiFileText className="w-5 h-5" /> View All Posts
                  </Link>
                  {!snapchatStatus?.isConnected && (
                    <button className="btn btn-warning btn-lg hover:scale-105 transition-transform" onClick={handleConnectSnapchat}>
                      <FaSnapchat className="w-5 h-5" /> Connect Snapchat
                    </button>
                  )}
                  {!instagramStatus?.isConnected && (
                    <button className="btn bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white btn-lg hover:scale-105 transition-transform" onClick={handleConnectInstagram}>
                      <FiInstagram className="w-5 h-5" /> Connect Instagram
                    </button>
                  )}
                  <Link href="/pricing" className="btn btn-outline btn-lg hover:scale-105 transition-transform">
                    <FiTrendingUp className="w-5 h-5" /> Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/20">
              <div className="card-body">
                <h2 className="card-title text-2xl">Your Plan</h2>
                <div className="mt-4">
                  <div className="badge badge-primary badge-lg mb-3 px-4 py-3">
                    {user?.subscription?.plan?.toUpperCase()}
                  </div>
                  <p className="text-sm opacity-70 mb-4 font-semibold">
                    {analytics?.postsThisMonth || 0} / {analytics?.planLimits?.postsPerMonth === -1 ? '∞' : analytics?.planLimits?.postsPerMonth} posts this month
                  </p>
                  {analytics?.planLimits?.postsPerMonth !== -1 && (
                    <progress
                      className="progress progress-primary h-3"
                      value={analytics?.postsThisMonth || 0}
                      max={analytics?.planLimits?.postsPerMonth || 100}
                    ></progress>
                  )}
                  <div className="mt-4">
                    <Link href="/pricing" className="btn btn-sm btn-primary w-full hover:scale-105 transition-transform">
                      Upgrade Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 mt-6">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <FiCheckCircle className="w-6 h-6" />
                Connected Platforms
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`relative overflow-hidden p-6 rounded-xl transition-all duration-300 ${
                  snapchatStatus?.isConnected 
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 hover:scale-105' 
                    : 'bg-base-200 border-2 border-base-300 opacity-60'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500 rounded-full">
                      <FaSnapchat className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Snapchat</h3>
                      <div className={`badge ${snapchatStatus?.isConnected ? 'badge-success' : 'badge-error'} badge-sm`}>
                        {snapchatStatus?.isConnected ? 'Connected' : 'Not Connected'}
                      </div>
                    </div>
                  </div>
                  {snapchatStatus?.isConnected && (
                    <div className="absolute top-2 right-2">
                      <FiCheckCircle className="w-6 h-6 text-success" />
                    </div>
                  )}
                </div>

                <div className={`relative overflow-hidden p-6 rounded-xl transition-all duration-300 ${
                  instagramStatus?.isConnected 
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500 hover:scale-105' 
                    : 'bg-base-200 border-2 border-base-300 opacity-60'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                      <FiInstagram className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Instagram</h3>
                      <div className={`badge ${instagramStatus?.isConnected ? 'badge-success' : 'badge-error'} badge-sm`}>
                        {instagramStatus?.isConnected ? 'Connected' : 'Not Connected'}
                      </div>
                    </div>
                  </div>
                  {instagramStatus?.isConnected && (
                    <div className="absolute top-2 right-2">
                      <FiCheckCircle className="w-6 h-6 text-success" />
                    </div>
                  )}
                </div>

                <div className={`relative overflow-hidden p-6 rounded-xl transition-all duration-300 ${
                  user?.subscription?.status === 'active' 
                    ? 'bg-primary/20 border-2 border-primary hover:scale-105' 
                    : 'bg-base-200 border-2 border-warning opacity-60'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${user?.subscription?.status === 'active' ? 'bg-primary' : 'bg-warning'} rounded-full`}>
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">Subscription</h3>
                      <div className={`badge ${user?.subscription?.status === 'active' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                        {user?.subscription?.status || 'Inactive'}
                      </div>
                    </div>
                  </div>
                  {user?.subscription?.status === 'active' && (
                    <div className="absolute top-2 right-2">
                      <FiCheckCircle className="w-6 h-6 text-success" />
                    </div>
                  )}
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
