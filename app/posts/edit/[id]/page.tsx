'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI } from '@/lib/api';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'none',
    platform: 'snapchat',
    scheduledFor: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getOne(params.id as string);
      const post = response.data.post;
      
      setFormData({
        title: post.title,
        content: post.content,
        mediaUrl: post.mediaUrl || '',
        mediaType: post.mediaType || 'none',
        platform: post.platform || 'snapchat',
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : '',
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await postsAPI.update(params.id as string, {
        ...formData,
        scheduledFor: formData.scheduledFor || null,
      });

      router.push('/posts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating post');
    } finally {
      setSaving(false);
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
          <div className="mb-6">
            <Link href="/posts" className="btn btn-ghost btn-sm">
              <FiArrowLeft /> Back to Posts
            </Link>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl mb-6">Edit Post</h1>

              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter post title"
                    className="input input-bordered"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32"
                    placeholder="Enter your content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Platform</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="snapchat">👻 Snapchat</option>
                    <option value="instagram">📷 Instagram</option>
                    <option value="both">🚀 Both Platforms</option>
                  </select>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Media Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  >
                    <option value="none">No Media</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                {formData.mediaType !== 'none' && (
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Media URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/media.jpg"
                      className="input input-bordered"
                      value={formData.mediaUrl}
                      onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    />
                  </div>
                )}

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Schedule For (Optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  />
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary ${saving ? 'btn-disabled' : ''}`}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <FiSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
