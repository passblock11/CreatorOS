'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI } from '@/lib/api';
import { FiPlus, FiHeart, FiMessageCircle, FiBookmark, FiEye, FiEdit, FiTrash2, FiSend } from 'react-icons/fi';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await postsAPI.getAll(params);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postsAPI.delete(id);
      setPosts(posts.filter((post) => post._id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await postsAPI.publish(id);
      fetchPosts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error publishing post');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      draft: 'badge-warning',
      scheduled: 'badge-info',
      published: 'badge-success',
      failed: 'badge-error',
    };
    return `badge ${badges[status] || 'badge-ghost'} badge-sm`;
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

        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">My Posts</h1>
              <p className="text-base-content/70">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
            <Link href="/posts/new" className="btn btn-primary gap-2">
              <FiPlus /> Create Post
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${filter === 'published' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('published')}
            >
              Published
            </button>
            <button
              className={`btn btn-sm ${filter === 'draft' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('draft')}
            >
              Drafts
            </button>
            <button
              className={`btn btn-sm ${filter === 'scheduled' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter('scheduled')}
            >
              Scheduled
            </button>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center py-16">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="card-title text-2xl mb-2">No posts yet</h2>
                <p className="text-base-content/70 mb-6">Start creating content to see it here</p>
                <Link href="/posts/new" className="btn btn-primary gap-2">
                  <FiPlus /> Create Your First Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="group relative bg-base-100 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/posts/${post._id}`)}
                >
                  {/* Image/Video Preview */}
                  <div className="relative aspect-square bg-base-300 overflow-hidden">
                    {post.mediaUrl ? (
                      <>
                        {post.mediaType === 'video' ? (
                          <video
                            src={post.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={post.mediaUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <div className="text-center">
                          <div className="text-6xl mb-2">📝</div>
                          <p className="text-sm opacity-70">Text Post</p>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <div className={getStatusBadge(post.status)}>
                        {post.status}
                      </div>
                    </div>

                    {/* Platform Badge */}
                    <div className="absolute top-2 left-2">
                      {post.platform === 'instagram' && (
                        <div className="badge badge-primary badge-sm">📷 IG</div>
                      )}
                      {post.platform === 'snapchat' && (
                        <div className="badge badge-accent badge-sm">👻 SC</div>
                      )}
                      {post.platform === 'both' && (
                        <div className="badge badge-secondary badge-sm">🚀 Both</div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center px-4">
                        {/* Stats */}
                        {post.status === 'published' && post.instagramPostId && (
                          <div className="flex gap-6 justify-center mb-4">
                            <div className="flex items-center gap-2">
                              <FiHeart className="w-5 h-5" />
                              <span className="font-semibold">
                                {post.analytics?.instagram?.likes || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMessageCircle className="w-5 h-5" />
                              <span className="font-semibold">
                                {post.analytics?.instagram?.comments || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiBookmark className="w-5 h-5" />
                              <span className="font-semibold">
                                {post.analytics?.instagram?.saves || 0}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-center">
                          <button
                            className="btn btn-sm btn-circle btn-ghost bg-white/20 hover:bg-white/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/posts/${post._id}`);
                            }}
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          {post.status !== 'published' && (
                            <>
                              <button
                                className="btn btn-sm btn-circle btn-ghost bg-white/20 hover:bg-white/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/posts/edit/${post._id}`);
                                }}
                                title="Edit"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button
                                className="btn btn-sm btn-circle btn-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublish(post._id);
                                }}
                                title="Publish"
                              >
                                <FiSend className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-circle btn-error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(post._id);
                            }}
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-base-content truncate mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    
                    {/* Additional Info */}
                    {post.status === 'published' && post.instagramPostId && (
                      <div className="flex gap-3 text-xs text-base-content/60 mt-2">
                        <span className="flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          {post.analytics?.instagram?.impressions || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          📊 {post.analytics?.instagram?.reach || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          ⚡ {post.analytics?.instagram?.engagement || 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteId && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Post</h3>
                <p className="py-4">
                  Are you sure you want to delete this post? This action cannot be undone and will also
                  remove it from the platform if published.
                </p>
                <div className="modal-action">
                  <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-error" onClick={() => handleDelete(deleteId)}>
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
