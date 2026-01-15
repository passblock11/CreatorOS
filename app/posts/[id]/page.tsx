'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI } from '@/lib/api';
import { FiArrowLeft, FiEdit, FiSend, FiTrash2, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncingAnalytics, setSyncingAnalytics] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  // Check if analytics need syncing (older than 30 minutes)
  const needsAnalyticsSync = 
    post?.status === 'published' &&
    post?.instagramPostId &&
    (!post?.analytics?.lastSynced ||
     Date.now() - new Date(post.analytics.lastSynced).getTime() > 30 * 60 * 1000);

  useEffect(() => {
    // Auto-trigger sync if needed and not already syncing
    if (needsAnalyticsSync && !syncingAnalytics && post) {
      const timer = setTimeout(() => {
        console.log('🔄 Auto-syncing analytics...');
        handleSyncAnalytics();
      }, 2000); // Wait 2 seconds after page load

      return () => clearTimeout(timer);
    }
  }, [needsAnalyticsSync, syncingAnalytics, post]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getOne(params.id as string);
      setPost(response.data.post);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await postsAPI.publish(post._id);
      fetchPost();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error publishing post');
    }
  };

  const handleSyncAnalytics = async () => {
    try {
      setSyncingAnalytics(true);
      await postsAPI.syncInstagramAnalytics(post._id);
      fetchPost();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error syncing analytics');
    } finally {
      setSyncingAnalytics(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postsAPI.delete(post._id);
      router.push('/posts');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting post');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'badge-warning',
      scheduled: 'badge-info',
      published: 'badge-success',
      failed: 'badge-error',
    };
    return colors[status] || 'badge-ghost';
  };

  const getPlatformEmoji = (platform: string) => {
    const emojis: any = {
      snapchat: '👻',
      instagram: '📷',
      both: '🚀',
    };
    return emojis[platform] || '📱';
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

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-base-200">
          <Navbar />
          <div className="container mx-auto p-6">
            <div className="alert alert-error">
              <span>{error || 'Post not found'}</span>
            </div>
            <Link href="/posts" className="btn btn-ghost mt-4">
              <FiArrowLeft /> Back to Posts
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="container mx-auto p-6 max-w-5xl">
          <div className="mb-6">
            <Link href="/posts" className="btn btn-ghost btn-sm">
              <FiArrowLeft /> Back to Posts
            </Link>
          </div>

          {/* Main Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Header with Title and Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                  <div className="flex gap-2 flex-wrap items-center">
                    <div className={`badge ${getStatusColor(post.status)}`}>
                      {post.status}
                    </div>
                    <div className="badge badge-outline">
                      {getPlatformEmoji(post.platform)} {post.platform}
                    </div>
                    <div className="badge badge-outline">
                      {post.mediaType === 'image' ? '🖼️' : post.mediaType === 'video' ? '🎬' : '📝'} {post.mediaType}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.status !== 'published' && (
                    <>
                      <Link
                        href={`/posts/edit/${post._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <FiEdit /> Edit
                      </Link>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handlePublish}
                      >
                        <FiSend /> Publish
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-error btn-outline btn-sm"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              <div className="divider"></div>

              {/* Content */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Content</h2>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Media Preview */}
              {post.mediaUrl && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Media</h2>
                  <div className="card bg-base-200">
                    <div className="card-body">
                      {post.mediaType === 'image' ? (
                        <img
                          src={post.mediaUrl}
                          alt={post.title}
                          className="w-full max-w-2xl mx-auto rounded-lg"
                        />
                      ) : post.mediaType === 'video' ? (
                        <video
                          src={post.mediaUrl}
                          controls
                          className="w-full max-w-2xl mx-auto rounded-lg"
                        />
                      ) : null}
                      <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost mt-2"
                      >
                        <FiExternalLink /> View Original
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Post Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">Created</div>
                    <div className="stat-value text-lg">
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="stat-desc">
                      {format(new Date(post.createdAt), 'h:mm a')}
                    </div>
                  </div>

                  {post.publishedAt && (
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Published</div>
                      <div className="stat-value text-lg">
                        {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                      </div>
                      <div className="stat-desc">
                        {format(new Date(post.publishedAt), 'h:mm a')}
                      </div>
                    </div>
                  )}

                  {post.scheduledFor && (
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Scheduled For</div>
                      <div className="stat-value text-lg">
                        {format(new Date(post.scheduledFor), 'MMM d, yyyy')}
                      </div>
                      <div className="stat-desc">
                        {format(new Date(post.scheduledFor), 'h:mm a')}
                      </div>
                    </div>
                  )}

                  {post.snapchatPostId && (
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Snapchat Post ID</div>
                      <div className="stat-value text-sm break-all">
                        {post.snapchatPostId.substring(0, 20)}...
                      </div>
                    </div>
                  )}

                  {post.instagramPostId && (
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Instagram Post ID</div>
                      <div className="stat-value text-sm break-all">
                        {post.instagramPostId.substring(0, 20)}...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics */}
              {post.status === 'published' && post.instagramPostId && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">📷 Instagram Analytics</h2>
                    <button
                      className={`btn btn-sm btn-ghost ${syncingAnalytics ? 'loading' : ''}`}
                      onClick={handleSyncAnalytics}
                      disabled={syncingAnalytics}
                    >
                      {!syncingAnalytics && <FiRefreshCw />}
                      {syncingAnalytics ? 'Syncing...' : 'Refresh Now'}
                    </button>
                  </div>
                  
                  {post.analytics?.lastSynced && (
                    <p className="text-sm opacity-60 mb-3">
                      Last synced: {format(new Date(post.analytics.lastSynced), 'MMM d, yyyy h:mm a')}
                      {needsAnalyticsSync && (
                        <span className="badge badge-warning badge-sm ml-2">Auto-syncing...</span>
                      )}
                    </p>
                  )}
                  
                  {!post.analytics?.lastSynced && (
                    <div className="alert alert-info mb-3">
                      <span className="text-sm">
                        ℹ️ Analytics are being synced automatically. This may take a moment...
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure text-primary">❤️</div>
                      <div className="stat-title">Likes</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.likes || 0}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure text-secondary">💬</div>
                      <div className="stat-title">Comments</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.comments || 0}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure">🔖</div>
                      <div className="stat-title">Saves</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.saves || 0}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure">👁️</div>
                      <div className="stat-title">Impressions</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.impressions || 0}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure">📊</div>
                      <div className="stat-title">Reach</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.reach || 0}
                      </div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-figure">⚡</div>
                      <div className="stat-title">Engagement</div>
                      <div className="stat-value text-2xl">
                        {post.analytics?.instagram?.engagement || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {post.error && (
                <div className="alert alert-error mt-6">
                  <div>
                    <h3 className="font-bold">Publishing Error</h3>
                    <p className="text-sm">{post.error.message}</p>
                    <p className="text-xs opacity-70">
                      {format(new Date(post.error.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Post</h3>
              <p className="py-4">
                Are you sure you want to delete "{post.title}"? This action cannot be undone.
              </p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
