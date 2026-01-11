'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI } from '@/lib/api';
import { FiSave, FiSend, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'none',
    scheduledFor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (action: 'save' | 'publish') => {
    setError('');
    setLoading(true);

    try {
      const postData = {
        ...formData,
        scheduledFor: formData.scheduledFor || null,
      };

      const response = await postsAPI.create(postData);
      const postId = response.data.post._id;

      if (action === 'publish') {
        await postsAPI.publish(postId);
      }

      router.push('/posts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="card-title text-3xl mb-6">Create New Post</h1>

              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}

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
                  <label className="label">
                    <span className="label-text-alt">Enter a publicly accessible URL</span>
                  </label>
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
                <label className="label">
                  <span className="label-text-alt">Leave empty to save as draft</span>
                </label>
              </div>

              <div className="card-actions justify-end mt-6 gap-2">
                <button
                  className={`btn btn-outline ${loading ? 'btn-disabled' : ''}`}
                  onClick={() => handleSubmit('save')}
                  disabled={loading}
                >
                  <FiSave /> Save Draft
                </button>
                <button
                  className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
                  onClick={() => handleSubmit('publish')}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <FiSend /> Publish Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
