'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI } from '@/lib/api';
import { FiPlus, FiEdit, FiTrash2, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

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
    return `badge ${badges[status] || 'badge-ghost'}`;
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      draft: <FiEdit />,
      scheduled: <FiClock />,
      published: <FiCheckCircle />,
      failed: <FiTrash2 />,
    };
    return icons[status] || <FiEdit />;
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">My Posts</h1>
            <Link href="/posts/new" className="btn btn-primary">
              <FiPlus /> Create Post
            </Link>
          </div>

          <div className="tabs tabs-boxed mb-6">
            <a
              className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </a>
            <a
              className={`tab ${filter === 'draft' ? 'tab-active' : ''}`}
              onClick={() => setFilter('draft')}
            >
              Drafts
            </a>
            <a
              className={`tab ${filter === 'scheduled' ? 'tab-active' : ''}`}
              onClick={() => setFilter('scheduled')}
            >
              Scheduled
            </a>
            <a
              className={`tab ${filter === 'published' ? 'tab-active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Published
            </a>
          </div>

          {posts.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl mb-4">No posts found</h2>
                <p className="mb-4">Create your first post to get started</p>
                <Link href="/posts/new" className="btn btn-primary">
                  <FiPlus /> Create Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="card-title">{post.title}</h2>
                          <div className={getStatusBadge(post.status)}>
                            {getStatusIcon(post.status)} {post.status}
                          </div>
                        </div>
                        <p className="opacity-70 mb-2">{post.content.substring(0, 150)}...</p>
                        <div className="flex gap-4 text-sm opacity-60">
                          <span>Created: {format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                          {post.scheduledFor && (
                            <span>
                              Scheduled: {format(new Date(post.scheduledFor), 'MMM d, yyyy HH:mm')}
                            </span>
                          )}
                          {post.publishedAt && (
                            <span>
                              Published: {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        {post.status === 'published' && (
                          <div className="flex gap-4 mt-2">
                            <span className="badge badge-outline">
                              👁️ {post.analytics?.views || 0} views
                            </span>
                            <span className="badge badge-outline">
                              📊 {post.analytics?.impressions || 0} impressions
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {post.status !== 'published' && (
                          <>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => router.push(`/posts/edit/${post._id}`)}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handlePublish(post._id)}
                            >
                              <FiSend /> Publish
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => setDeleteId(post._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    {post.error && (
                      <div className="alert alert-error mt-2">
                        <span>Error: {post.error.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteId && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Post</h3>
                <p className="py-4">Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="modal-action">
                  <button className="btn" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-error" onClick={() => handleDelete(deleteId)}>
                    Delete
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
