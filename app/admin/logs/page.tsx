'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminAPI } from '@/lib/api';
import { format } from 'date-fns';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('');
  const [successFilter, setSuccessFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
  }, [serviceFilter, successFilter]);

  const fetchLogs = async () => {
    try {
      const params: any = {};
      if (serviceFilter) params.service = serviceFilter;
      if (successFilter) params.success = successFilter;

      const response = await adminAPI.getApiLogs(params);
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
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
          <h1 className="text-4xl font-bold mb-8 text-base-content">API Logs</h1>

          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  className="select select-bordered"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">All Services</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="stripe">Stripe</option>
                  <option value="internal">Internal</option>
                </select>

                <select
                  className="select select-bordered"
                  value={successFilter}
                  onChange={(e) => setSuccessFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="true">Success</option>
                  <option value="false">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Service</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td className="text-sm">
                          {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                        </td>
                        <td>
                          <span className="badge badge-outline capitalize">{log.service}</span>
                        </td>
                        <td className="text-sm">{log.action}</td>
                        <td className="text-sm">{log.user?.name || 'System'}</td>
                        <td>
                          <span
                            className={`badge ${
                              log.success ? 'badge-success' : 'badge-error'
                            }`}
                          >
                            {log.success ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td className="text-sm">{log.duration ? `${log.duration}ms` : '-'}</td>
                        <td>
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={() => setSelectedLog(log)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {logs.length === 0 && (
                <div className="text-center py-8 text-base-content/70">No logs found</div>
              )}
            </div>
          </div>
        </div>

        {selectedLog && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg mb-4">Log Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">General Info</h4>
                  <div className="bg-base-200 p-3 rounded-lg space-y-1 text-sm">
                    <p>
                      <strong>Service:</strong> {selectedLog.service}
                    </p>
                    <p>
                      <strong>Action:</strong> {selectedLog.action}
                    </p>
                    <p>
                      <strong>User:</strong> {selectedLog.user?.name || 'System'} (
                      {selectedLog.user?.email || 'N/A'})
                    </p>
                    <p>
                      <strong>Time:</strong>{' '}
                      {format(new Date(selectedLog.createdAt), 'PPpp')}
                    </p>
                    <p>
                      <strong>Duration:</strong> {selectedLog.duration}ms
                    </p>
                    <p>
                      <strong>Status Code:</strong> {selectedLog.statusCode}
                    </p>
                  </div>
                </div>

                {selectedLog.requestData && (
                  <div>
                    <h4 className="font-semibold mb-2">Request Data</h4>
                    <div className="bg-base-200 p-3 rounded-lg overflow-auto max-h-40">
                      <pre className="text-xs">
                        {JSON.stringify(selectedLog.requestData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedLog.responseData && (
                  <div>
                    <h4 className="font-semibold mb-2">Response Data</h4>
                    <div className="bg-base-200 p-3 rounded-lg overflow-auto max-h-40">
                      <pre className="text-xs">
                        {JSON.stringify(selectedLog.responseData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedLog.error && (
                  <div>
                    <h4 className="font-semibold mb-2 text-error">Error</h4>
                    <div className="bg-error bg-opacity-10 p-3 rounded-lg">
                      <p className="text-sm text-error">{selectedLog.error.message}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setSelectedLog(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
