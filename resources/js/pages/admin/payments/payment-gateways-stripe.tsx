import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';

// Utility for CSV export
function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const replacer = (key: string, value: any) => value === null ? '' : value;
  const header = Object.keys(data[0]);
  const csv = [header.join(','), ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Utility for JSON export
function exportToJSON(data: any[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function AdminStripeSettings() {
  const [stripeKey, setStripeKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [testResult, setTestResult] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  // Diagnostics state
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [diagLoading, setDiagLoading] = useState(false);

  // UI state for modals and forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any|null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', active: true });
  const [productSearch, setProductSearch] = useState('');
  const [productActionLoading, setProductActionLoading] = useState(false);

  useEffect(() => {
    // Fetch current Stripe config from backend
    fetch('/api/admin/stripe/config')
      .then(res => res.json())
      .then(data => {
        setStripeKey(data.stripe_key || '');
        setWebhookSecret(data.webhook_secret || '');
      });
  }, []);

  const handleTest = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stripe/test');
    const data = await res.json();
    setTestResult(data.success ? 'Stripe connection successful!' : `Error: ${data.error}`);
    setLoading(false);
  };

  const fetchDiagnostics = async () => {
    setDiagLoading(true);
    const [acc, wh, ev, prod] = await Promise.all([
      fetch('/api/admin/stripe/account-details', { credentials: 'same-origin' }).then(r => r.json()),
      fetch('/api/admin/stripe/webhooks', { credentials: 'same-origin' }).then(r => r.json()),
      fetch('/api/admin/stripe/events', { credentials: 'same-origin' }).then(r => r.json()),
      fetch('/api/admin/stripe/products', { credentials: 'same-origin' }).then(r => r.json()),
    ]);
    setAccountDetails(acc.account || null);
    setWebhooks(wh.webhooks || []);
    setEvents(ev.events || []);
    setProducts(prod.products || []);
    setDiagLoading(false);
  };

  // Product/Plan CRUD handlers
  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', active: true });
    setShowProductModal(true);
  };
  const openEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({ name: prod.name || '', description: prod.description || '', active: prod.active });
    setShowProductModal(true);
  };
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setProductForm(f => ({ ...f, [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value }));
  };
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductActionLoading(true);
    const url = editingProduct ? `/api/admin/stripe/products/${editingProduct.id}` : '/api/admin/stripe/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
      credentials: 'same-origin',
    });
    setProductActionLoading(false);
    setShowProductModal(false);
    fetchDiagnostics();
  };
  const handleArchiveProduct = async (prod: any) => {
    if (!window.confirm('Archive this product?')) return;
    setProductActionLoading(true);
    await fetch(`/api/admin/stripe/products/${prod.id}/archive`, { method: 'POST', credentials: 'same-origin' });
    setProductActionLoading(false);
    fetchDiagnostics();
  };

  // Filtered products
  const filteredProducts = products.filter((prod: any) =>
    prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (prod.description && prod.description.toLowerCase().includes(productSearch.toLowerCase())) ||
    prod.id.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Only show masked values, never reveal the actual secret key
  return (
    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Payment Gateways', href: '/admin/payment-gateways' },
          { title: 'Stripe', href: '/admin/payment-gateways/stripe' },
        ]} />
        <Head title="Stripe Settings" />
        <div className="p-6 max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Stripe Payment Gateway</h1>
          <div className="mb-6 text-gray-600">Your Stripe API keys are read-only and managed via the server's .env file. To update, please edit your .env and redeploy.</div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Stripe Publishable Key</label>
            <input type="password" className="w-full border rounded px-3 py-2 bg-gray-100" value={stripeKey ? '••••••••••••••••••••••••••••••••' : ''} readOnly />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Webhook Secret</label>
            <input type="password" className="w-full border rounded px-3 py-2 bg-gray-100" value={webhookSecret ? '••••••••••••••••••••••••••••••••' : ''} readOnly />
          </div>
          <div className="flex gap-2 mb-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" onClick={handleTest} disabled={loading}>Test Connection</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" onClick={fetchDiagnostics} disabled={diagLoading}>Show Diagnostics</button>
          </div>
          {testResult && <div className="mt-2 text-sm text-blue-700">{testResult}</div>}

          {/* Diagnostics Section */}
          {(diagLoading || accountDetails || webhooks.length > 0 || events.length > 0 || products.length > 0) && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Stripe Diagnostics</h2>
              {diagLoading && <div>Loading diagnostics...</div>}
              {accountDetails && (
                <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="font-medium mb-2 text-gray-800">Account Details</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                    <div className="font-semibold">ID:</div><div>{accountDetails.id}</div>
                    <div className="font-semibold">Email:</div><div>{accountDetails.email}</div>
                    <div className="font-semibold">Country:</div><div>{accountDetails.country}</div>
                    <div className="font-semibold">Business Type:</div><div>{accountDetails.business_type}</div>
                    <div className="font-semibold">Charges Enabled:</div><div>{String(accountDetails.charges_enabled)}</div>
                    <div className="font-semibold">Payouts Enabled:</div><div>{String(accountDetails.payouts_enabled)}</div>
                  </div>
                </div>
              )}
              {webhooks.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="font-medium mb-2 text-gray-800">Webhooks</div>
                  <ul className="text-sm text-gray-700 list-disc ml-6">
                    {webhooks.map((wh, i) => (
                      <li key={wh.id || i} className="mb-1">
                        <span className="font-mono text-xs">{wh.url}</span> <span className={`text-xs ml-2 ${wh.status === 'enabled' ? 'text-green-700' : 'text-red-700'}`}>({wh.status})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {events.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="font-medium mb-2 text-gray-800">Recent Events</div>
                  <ul className="text-sm text-gray-700 list-disc ml-6">
                    {events.map((ev, i) => (
                      <li key={ev.id || i} className="mb-1">
                        <span className="font-mono text-xs">{ev.type}</span> <span className="text-xs text-gray-500 ml-2">{ev.created ? new Date(ev.created * 1000).toLocaleString() : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Products/Plans Section */}
              <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">Stripe Products & Plans</div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700" onClick={openCreateProduct}>+ New Product</button>
                    <button className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700" onClick={() => exportToCSV(filteredProducts, 'stripe-products.csv')}>Export CSV</button>
                    <button className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700" onClick={() => exportToJSON(filteredProducts, 'stripe-products.json')}>Export JSON</button>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1 mb-2 text-sm"
                  placeholder="Search products/plans..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                />
                <ul className="text-sm text-gray-700 list-disc ml-6">
                  {filteredProducts.length === 0 && <li className="text-gray-400">No products found.</li>}
                  {filteredProducts.map((prod) => (
                    <li key={prod.id} className="mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{prod.name}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${prod.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{prod.active ? 'Active' : 'Archived'}</span>
                        </div>
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200" onClick={() => openEditProduct(prod)}>Edit</button>
                          <button className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200" onClick={() => handleArchiveProduct(prod)} disabled={!prod.active}>Archive</button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">ID: {prod.id}</div>
                      {prod.description && <div className="text-xs text-gray-600">{prod.description}</div>}
                      <div className="text-xs text-gray-500">Created: {prod.created ? new Date(prod.created * 1000).toLocaleString() : ''}</div>
                      {prod.prices && prod.prices.length > 0 && (
                        <ul className="ml-4 mt-1">
                          {prod.prices.map((price: any) => (
                            <li key={price.id} className="text-xs">
                              {price.nickname || price.id}: {price.unit_amount / 100} {price.currency.toUpperCase()} / {price.recurring?.interval || 'one-time'}
                              <span className={`ml-2 px-1 rounded ${price.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{price.active ? 'Active' : 'Archived'}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" className="w-full border rounded px-2 py-1" value={productForm.name} onChange={handleProductFormChange} required />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" className="w-full border rounded px-2 py-1" value={productForm.description} onChange={handleProductFormChange} />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <input type="checkbox" name="active" checked={productForm.active} onChange={handleProductFormChange} id="active" />
                    <label htmlFor="active" className="text-sm">Active</label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={productActionLoading}>{editingProduct ? 'Save' : 'Create'}</button>
                    <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowProductModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </AdminContent>
    </AdminShell>
  );
}
