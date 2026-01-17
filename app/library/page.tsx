'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mediaLibraryAPI } from '@/lib/api';
import { FiImage, FiVideo, FiTrash2, FiTag, FiSearch, FiFilter, FiX, FiCheck, FiDownload } from 'react-icons/fi';

export default function MediaLibraryPage() {
  const router = useRouter();
  const [media, setMedia] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
    tags: [] as string[],
    sortBy: 'createdAt',
    order: 'desc',
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<any>(null);
  const [editTags, setEditTags] = useState<string>('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, [filters, page]);

  const fetchMedia = async () => {
    try {
      const params = {
        ...filters,
        tags: filters.tags.join(','),
        page,
        limit: 24,
      };
      const response = await mediaLibraryAPI.getMedia(params);
      setMedia(response.data.media);
      setTotalPages(response.data.pagination.pages);
      if (response.data.filters) {
        setAllTags(response.data.filters.tags);
        setAllCategories(response.data.filters.categories);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await mediaLibraryAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSelectMedia = (id: string) => {
    const newSelected = new Set(selectedMedia);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMedia(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMedia.size === media.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(media.map(m => m._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMedia.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedMedia.size} media item(s)? This cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      await mediaLibraryAPI.bulkDelete(Array.from(selectedMedia));
      setSelectedMedia(new Set());
      fetchMedia();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting media');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this media? This cannot be undone.');
    if (!confirmed) return;

    try {
      await mediaLibraryAPI.deleteMedia(id);
      fetchMedia();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting media');
    }
  };

  const openEditModal = (mediaItem: any) => {
    setSelectedForEdit(mediaItem);
    setEditTags(mediaItem.tags?.join(', ') || '');
    setEditCategory(mediaItem.category || 'uncategorized');
    setEditDescription(mediaItem.description || '');
  };

  const handleSaveEdit = async () => {
    if (!selectedForEdit) return;

    try {
      const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
      await mediaLibraryAPI.updateMedia(selectedForEdit._id, {
        tags,
        category: editCategory,
        description: editDescription,
      });
      setSelectedForEdit(null);
      fetchMedia();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating media');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">Media Library</h1>
            <p className="text-base-content/70">Manage and organize all your media files</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70">Total Files</p>
                      <p className="text-3xl font-bold">{stats.totalMedia || 0}</p>
                    </div>
                    <FiImage className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70">Images</p>
                      <p className="text-3xl font-bold">{stats.totalImages || 0}</p>
                    </div>
                    <FiImage className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70">Videos</p>
                      <p className="text-3xl font-bold">{stats.totalVideos || 0}</p>
                    </div>
                    <FiVideo className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70">Storage Used</p>
                      <p className="text-3xl font-bold">{formatFileSize(stats.totalSize || 0)}</p>
                    </div>
                    <FiDownload className="w-8 h-8 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="form-control">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search media..."
                        className="input input-bordered w-full"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                      <button className="btn btn-square">
                        <FiSearch />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Toggle */}
                <button
                  className="btn btn-outline gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter />
                  Filters
                </button>

                {/* Bulk Actions */}
                {selectedMedia.size > 0 && (
                  <div className="flex gap-2">
                    <span className="badge badge-primary badge-lg">
                      {selectedMedia.size} selected
                    </span>
                    <button
                      className="btn btn-error btn-sm gap-2"
                      onClick={handleBulkDelete}
                    >
                      <FiTrash2 />
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type Filter */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Type</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      >
                        <option value="all">All Types</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      >
                        <option value="all">All Categories</option>
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Sort By</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={`${filters.sortBy}-${filters.order}`}
                        onChange={(e) => {
                          const [sortBy, order] = e.target.value.split('-');
                          setFilters({ ...filters, sortBy, order });
                        }}
                      >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="usageCount-desc">Most Used</option>
                        <option value="size-desc">Largest First</option>
                        <option value="size-asc">Smallest First</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  {allTags.length > 0 && (
                    <div className="mt-4">
                      <label className="label">
                        <span className="label-text">Filter by Tags</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            className={`badge badge-lg ${
                              filters.tags.includes(tag) ? 'badge-primary' : 'badge-ghost'
                            }`}
                            onClick={() => {
                              const newTags = filters.tags.includes(tag)
                                ? filters.tags.filter((t) => t !== tag)
                                : [...filters.tags, tag];
                              setFilters({ ...filters, tags: newTags });
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Media Grid */}
          {media.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center py-16">
                <FiImage className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="card-title text-2xl mb-2">No media found</h2>
                <p className="text-base-content/70 mb-6">
                  Upload media files when creating posts to build your library
                </p>
                <button className="btn btn-primary" onClick={() => router.push('/posts/new')}>
                  Create Your First Post
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="mb-4">
                <label className="cursor-pointer label justify-start gap-2 w-fit">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedMedia.size === media.length && media.length > 0}
                    onChange={handleSelectAll}
                  />
                  <span className="label-text">Select All</span>
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                {media.map((item) => (
                  <div
                    key={item._id}
                    className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative ${
                      selectedMedia.has(item._id) ? 'ring-4 ring-primary' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedMedia.has(item._id)}
                        onChange={() => handleSelectMedia(item._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Media Preview */}
                    <figure
                      className="relative aspect-square bg-base-300"
                      onClick={() => openEditModal(item)}
                    >
                      {item.type === 'video' ? (
                        <>
                          <video src={item.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <FiVideo className="w-12 h-12 text-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Usage Badge */}
                      {item.usageCount > 0 && (
                        <div className="absolute bottom-2 right-2 badge badge-sm badge-success">
                          Used {item.usageCount}x
                        </div>
                      )}
                    </figure>

                    {/* Info */}
                    <div className="card-body p-3">
                      <p className="text-xs truncate font-medium">{item.filename}</p>
                      <div className="flex gap-1 flex-wrap">
                        {item.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="badge badge-xs badge-ghost">
                            {tag}
                          </span>
                        ))}
                        {item.tags?.length > 2 && (
                          <span className="badge badge-xs badge-ghost">
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-60">{formatFileSize(item.size)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="btn btn-ghost">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Modal */}
        {selectedForEdit && (
          <div className="modal modal-open">
            <div className="modal-box max-w-4xl">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setSelectedForEdit(null)}
              >
                <FiX />
              </button>

              <h3 className="font-bold text-lg mb-4">Edit Media</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <figure className="relative aspect-square bg-base-300 rounded-lg overflow-hidden">
                    {selectedForEdit.type === 'video' ? (
                      <video src={selectedForEdit.url} controls className="w-full h-full object-contain" />
                    ) : (
                      <img
                        src={selectedForEdit.url}
                        alt={selectedForEdit.filename}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </figure>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><strong>File:</strong> {selectedForEdit.filename}</p>
                    <p><strong>Size:</strong> {formatFileSize(selectedForEdit.size)}</p>
                    <p><strong>Dimensions:</strong> {selectedForEdit.width} x {selectedForEdit.height}</p>
                    <p><strong>Uploaded:</strong> {formatDate(selectedForEdit.createdAt)}</p>
                    <p><strong>Used:</strong> {selectedForEdit.usageCount} times</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tags (comma separated)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="nature, sunset, beach"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="uncategorized"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Optional description..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-6">
                    <button
                      className="btn btn-error btn-outline gap-2"
                      onClick={() => {
                        handleDelete(selectedForEdit._id);
                        setSelectedForEdit(null);
                      }}
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                    <button className="btn btn-ghost" onClick={() => setSelectedForEdit(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary gap-2" onClick={handleSaveEdit}>
                      <FiCheck />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
