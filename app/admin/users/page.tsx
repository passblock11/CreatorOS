'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminAPI } from '@/lib/api';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search, planFilter]);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (planFilter) params.plan = planFilter;

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      await adminAPI.updateUser(editUser._id, {
        role: editUser.role,
        subscriptionPlan: editUser.subscription.plan,
        subscriptionStatus: editUser.subscription.status,
      });
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-base-200">
        <Navbar />

        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-8">User Management</h1>

          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="form-control flex-1">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="input input-bordered w-full"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-square">
                      <FiSearch />
                    </button>
                  </div>
                </div>

                <select
                  className="select select-bordered"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="font-semibold">{user.name}</td>
                        <td className="text-sm opacity-70">{user.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === 'admin' ? 'badge-secondary' : 'badge-ghost'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-primary">{user.subscription.plan}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              user.subscription.status === 'active'
                                ? 'badge-success'
                                : 'badge-warning'
                            }`}
                          >
                            {user.subscription.status}
                          </span>
                        </td>
                        <td className="text-sm">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => setEditUser(user)}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-error btn-outline"
                              onClick={() => setDeleteId(user._id)}
                              disabled={user.role === 'admin'}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {users.length === 0 && (
                <div className="text-center py-8 opacity-70">No users found</div>
              )}
            </div>
          </div>
        </div>

        {editUser && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit User</h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Subscription Plan</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editUser.subscription.plan}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      subscription: { ...editUser.subscription, plan: e.target.value },
                    })
                  }
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Subscription Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editUser.subscription.status}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      subscription: { ...editUser.subscription, status: e.target.value },
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setEditUser(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateUser}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete User</h3>
              <p className="py-4">
                Are you sure you want to delete this user? This action cannot be undone and will
                delete all their posts and data.
              </p>
              <div className="modal-action">
                <button className="btn" onClick={() => setDeleteId(null)}>
                  Cancel
                </button>
                <button className="btn btn-error" onClick={() => handleDeleteUser(deleteId)}>
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
