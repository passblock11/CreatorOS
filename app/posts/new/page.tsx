'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { postsAPI, aiAPI } from '@/lib/api';
import { uploadMedia, formatFileSize, getUploadMethodDescription } from '@/lib/uploadHelper';
import { FiSave, FiSend, FiArrowLeft, FiUpload, FiX, FiImage, FiZap, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'none',
    platform: 'snapchat',
    scheduledFor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    setSelectedFile(file);
    setFormData({
      ...formData,
      mediaType: isImage ? 'image' : 'video',
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({ ...formData, mediaUrl: '', mediaType: 'none' });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setUploadingFile(true);
    setUploadProgress('Uploading...');
    setError('');

    try {
      const result = await uploadMedia(selectedFile, (progress) => {
        setUploadProgress(`Uploading... ${progress}%`);
      });
      
      setFormData({ ...formData, mediaUrl: result.url });
      setUploadProgress('Upload complete!');
      
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      setUploadProgress('');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) {
      setError('Please enter a title first');
      return;
    }

    setGeneratingAI(true);
    setError('');

    try {
      const response = await aiAPI.generateContent({
        title: formData.title,
        platform: formData.platform,
        options: {
          tone: 'engaging',
          length: 'medium',
          includeHashtags: true,
          includeEmojis: true,
        },
      });

      setAiGeneratedContent(response.data.data.content);
      setAiModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error generating content');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUseAIContent = () => {
    setFormData({ ...formData, content: aiGeneratedContent });
    setAiModalOpen(false);
  };

  const handleRegenerateAI = async () => {
    setAiModalOpen(false);
    await handleGenerateAI();
  };

  const handleSubmit = async (action: 'save' | 'publish') => {
    setError('');

    // Upload file if selected but not uploaded
    if (selectedFile && !formData.mediaUrl) {
      setError('Please upload the selected file before creating the post');
      return;
    }

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
                  {formData.title && (
                    <button
                      type="button"
                      className={`btn btn-sm btn-primary ${generatingAI ? 'loading' : ''}`}
                      onClick={handleGenerateAI}
                      disabled={generatingAI || !formData.title}
                    >
                      {!generatingAI && <FiZap />}
                      {generatingAI ? 'Generating...' : 'Generate with AI'}
                    </button>
                  )}
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Enter your content or use AI to generate it"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                ></textarea>
                {!formData.title && (
                  <label className="label">
                    <span className="label-text-alt text-info">
                      💡 Enter a title above to generate AI content
                    </span>
                  </label>
                )}
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
                <label className="label">
                  <span className="label-text-alt">Select where to publish this post</span>
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Media (Image or Video)</span>
                </label>
                
                {!selectedFile && !formData.mediaUrl && (
                  <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FiUpload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm opacity-60">Images or Videos (Max 100MB)</p>
                      <p className="text-xs opacity-40 mt-2">
                        Supports: JPG, PNG, GIF, MP4, MOV, AVI
                      </p>
                    </label>
                  </div>
                )}

                {selectedFile && !formData.mediaUrl && (
                  <div className="card bg-base-200 p-4">
                    <div className="flex items-center gap-4">
                      {previewUrl && (
                        <div className="avatar">
                          <div className="w-20 h-20 rounded">
                            {formData.mediaType === 'image' ? (
                              <img src={previewUrl} alt="Preview" className="object-cover" />
                            ) : (
                              <video src={previewUrl} className="object-cover" />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{selectedFile.name}</p>
                        <p className="text-sm opacity-60">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {formData.mediaType}
                        </p>
                        {uploadProgress && (
                          <p className="text-sm text-success mt-1">{uploadProgress}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={`btn btn-primary btn-sm ${uploadingFile ? 'loading' : ''}`}
                          onClick={handleUploadFile}
                          disabled={uploadingFile}
                        >
                          {!uploadingFile && <FiUpload />}
                          Upload
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={handleRemoveFile}
                          disabled={uploadingFile}
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {formData.mediaUrl && (
                  <div className="card bg-base-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-20 h-20 rounded">
                          {formData.mediaType === 'image' ? (
                            <img src={formData.mediaUrl} alt="Uploaded" className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-base-300">
                              <FiImage className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">✅ Media uploaded successfully</p>
                        <p className="text-sm opacity-60">{formData.mediaType}</p>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={handleRemoveFile}
                      >
                        <FiX /> Remove
                      </button>
                    </div>
                  </div>
                )}
                
                <label className="label">
                  <span className="label-text-alt">
                    Upload an image or video to include with your post (required for publishing)
                  </span>
                </label>
              </div>

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

        {/* AI Generated Content Modal */}
        {aiModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiZap className="text-primary" /> AI Generated Content
              </h3>
              
              <div className="bg-base-200 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap">{aiGeneratedContent}</p>
              </div>

              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>You can edit this content after using it</span>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setAiModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleRegenerateAI}
                >
                  <FiRefreshCw /> Regenerate
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUseAIContent}
                >
                  Use This Content
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
