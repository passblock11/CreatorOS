'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatCard from '@/components/StatCard';
import { adminAPI } from '@/lib/api';
import { FiUsers, FiFileText, FiDollarSign, FiActivity } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<FiUsers className="w-8 h-8" />}
              description="All registered users"
            />
            <StatCard
              title="Active Subscriptions"
              value={stats?.activeSubscriptions || 0}
              icon={<FiDollarSign className="w-8 h-8" />}
              description="Paid subscribers"
            />
            <StatCard
              title="Total Posts"
              value={stats?.totalPosts || 0}
              icon={<FiFileText className="w-8 h-8" />}
              description="All time posts"
            />
            <StatCard
              title="Published Posts"
              value={stats?.publishedPosts || 0}
              icon={<FiActivity className="w-8 h-8" />}
              description="Successfully published"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Users by Plan</h2>
                <div className="space-y-3 mt-4">
                  {stats?.usersByPlan?.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <span className="badge badge-lg badge-primary">{item._id?.toUpperCase()}</span>
                      <span className="text-2xl font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">API Stats (Last 100 calls)</h2>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span>Total Calls</span>
                    <span className="text-2xl font-bold">{stats?.apiStats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-success">Successful</span>
                    <span className="text-2xl font-bold text-success">
                      {stats?.apiStats?.successful || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-error">Failed</span>
                    <span className="text-2xl font-bold text-error">
                      {stats?.apiStats?.failed || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">Recent Users</h2>
                  <Link href="/admin/users" className="btn btn-sm btn-outline">
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Plan</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentUsers?.map((user: any) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td className="text-sm opacity-70">{user.email}</td>
                          <td>
                            <span className="badge badge-sm badge-primary">
                              {user.subscription.plan}
                            </span>
                          </td>
                          <td className="text-sm">
                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">API Services</h2>
                  <Link href="/admin/logs" className="btn btn-sm btn-outline">
                    View Logs
                  </Link>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats?.apiStats?.byService || {}).map(([service, data]: [string, any]) => (
                    <div key={service} className="card bg-base-200">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold capitalize">{service}</h3>
                          <span className="badge badge-outline">{data.total} calls</span>
                        </div>
                        <div className="flex gap-4 text-sm mt-2">
                          <span className="text-success">✓ {data.successful}</span>
                          <span className="text-error">✗ {data.failed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
