import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminLogViewer() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Placeholder: In production, fetch logs via an API route with proper auth
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load logs.');
        setLoading(false);
      });
  }, []);

  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Settings', href: '/admin/settings' },
          { title: 'Log Viewer', href: '/admin/settings/log-viewer' },
        ]} />
        <Head title="Log Viewer" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Log Viewer</h1>
          <div className="text-gray-600 mb-4">Monitor Laravel logs for errors and warnings. (This is a placeholder. Secure API endpoint required for production.)</div>
          <div className="flex gap-2 mb-4">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear the log file?')) {
                  await fetch('/api/admin/logs/clear', { method: 'POST' });
                  setLogs([]);
                }
              }}
            >
              Clear Log File
            </button>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" onChange={e => {
                const pre = document.getElementById('log-pre');
                if (pre) pre.style.whiteSpace = e.target.checked ? 'pre-wrap' : 'pre';
              }} />
              Word Wrap
            </label>
          </div>
          <pre
            id="log-pre"
            className="bg-black text-green-200 p-4 rounded overflow-x-auto max-h-[60vh] text-xs"
            style={{ whiteSpace: 'pre', wordBreak: 'break-word' }}
          >
            {logs.length > 0 ? logs.join('\n') : (!loading && !error ? 'No logs found.' : '')}
          </pre>
        </div>
      </AdminContent>
    </AdminShell>
  );
}
