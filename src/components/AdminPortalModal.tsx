import { useEffect, useState } from 'react';
import { Lock, Pencil, Plus, Trash2, X } from 'lucide-react';
import { NIGERIAN_STATES } from '../data/states';
import type {
  ApplicationStatus,
  AvailabilityStatus,
  BrandContactConfig,
  ContactStatus,
  ContactSubmission,
  DepotRecord,
  DepotType,
  DistributorApplication,
  ProductEnquiry,
} from '../types/api';

interface AdminPortalModalProps {
  open: boolean;
  initialTab?: 'depots' | 'distributors' | 'enquiries';
  onClose: () => void;
  onDataUpdated: () => void;
}

export function AdminPortalModal({
  open,
  initialTab = 'depots',
  onClose,
  onDataUpdated,
}: AdminPortalModalProps) {
  const [passkey, setPasskey] = useState('');
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'depots' | 'distributors' | 'enquiries'>(initialTab);

  const [loadingData, setLoadingData] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [depots, setDepots] = useState<DepotRecord[]>([]);
  const [distributors, setDistributors] = useState<DistributorApplication[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [productEnquiries, setProductEnquiries] = useState<ProductEnquiry[]>([]);
  const [config, setConfig] = useState<BrandContactConfig | null>(null);

  const [editingDepotId, setEditingDepotId] = useState<string | null>(null);
  const [depotState, setDepotState] = useState('Lagos');
  const [depotName, setDepotName] = useState('');
  const [depotType, setDepotType] = useState<DepotType>('confirmed_depot');
  const [depotAddress, setDepotAddress] = useState('');
  const [depotPhone, setDepotPhone] = useState('');
  const [depotHours, setDepotHours] = useState('Mon–Sat, 08:00–17:30');
  const [depotStatus, setDepotStatus] = useState<AvailabilityStatus>('Operational');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  async function loadOverview(key: string) {
    setLoadingData(true);
    setActionError(null);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { 'x-admin-key': key },
      });
      if (!res.ok) {
        throw new Error('Failed to load administration records.');
      }
      const data = await res.json();
      setDepots(data.depots || []);
      setDistributors(data.distributors || []);
      setContacts(data.contacts || []);
      setProductEnquiries(data.productEnquiries || []);
      setConfig(data.config || null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to load records.');
    } finally {
      setLoadingData(false);
    }
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const trimmed = passkey.trim();
    if (!trimmed) {
      setAuthError('Please enter your administrator passkey.');
      return;
    }

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        setAuthError(data.error || 'Incorrect administrator passkey.');
        return;
      }
      setAdminKey(trimmed);
      await loadOverview(trimmed);
    } catch {
      setAuthError('Could not connect to verification service.');
    }
  }

  function resetDepotForm() {
    setEditingDepotId(null);
    setDepotState('Lagos');
    setDepotName('');
    setDepotType('confirmed_depot');
    setDepotAddress('');
    setDepotPhone('');
    setDepotHours('Mon–Sat, 08:00–17:30');
    setDepotStatus('Operational');
  }

  function startEditDepot(depot: DepotRecord) {
    setEditingDepotId(depot.id);
    setDepotState(depot.state);
    setDepotName(depot.depotName);
    setDepotType(depot.depotType);
    setDepotAddress(depot.address);
    setDepotPhone(depot.phone);
    setDepotHours(depot.operatingHours);
    setDepotStatus(depot.availabilityStatus);
  }

  async function handleSaveDepot(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey) return;
    setActionError(null);
    setActionNotice(null);

    try {
      const url = editingDepotId ? `/api/admin/depots/${editingDepotId}` : '/api/admin/depots';
      const method = editingDepotId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          state: depotState,
          depotName,
          depotType,
          address: depotAddress,
          phone: depotPhone,
          operatingHours: depotHours,
          availabilityStatus: depotStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Could not save depot entry.');
        return;
      }
      setActionNotice(editingDepotId ? 'Depot entry updated.' : 'New depot entry added.');
      resetDepotForm();
      await loadOverview(adminKey);
      onDataUpdated();
    } catch {
      setActionError('Network error saving depot entry.');
    }
  }

  async function handleDeleteDepot(id: string) {
    if (!adminKey) return;
    setActionError(null);
    setActionNotice(null);
    try {
      const res = await fetch(`/api/admin/depots/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      if (!res.ok) {
        const data = await res.json();
        setActionError(data.error || 'Could not delete depot entry.');
        return;
      }
      setActionNotice('Depot entry removed.');
      await loadOverview(adminKey);
      onDataUpdated();
    } catch {
      setActionError('Network error removing depot entry.');
    }
  }

  async function handleDistributorStatus(id: string, status: ApplicationStatus) {
    if (!adminKey) return;
    try {
      const res = await fetch(`/api/admin/distributors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadOverview(adminKey);
      }
    } catch {
      setActionError('Failed to update application status.');
    }
  }

  async function handleContactStatus(id: string, status: ContactStatus) {
    if (!adminKey) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadOverview(adminKey);
      }
    } catch {
      setActionError('Failed to update message status.');
    }
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey || !config) return;
    setActionError(null);
    setActionNotice(null);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Could not update brand contact info.');
        return;
      }
      setActionNotice('Brand contact configuration saved.');
      onDataUpdated();
    } catch {
      setActionError('Network error saving contact configuration.');
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="LABAN DRINK Administration Portal"
      className="fixed inset-0 z-50 bg-[#140326]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#21063D] text-white">
          <div>
            <p className="text-xs font-semibold text-[#C8F52C]">LABAN DRINK Trade Operations</p>
            <h3 className="font-display text-xl font-bold">Administration Portal</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Close administration portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!adminKey ? (
          <form onSubmit={handleUnlock} className="p-8 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#35105F]/10 text-[#35105F] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-[#21063D]">
                Administrator Verification
              </h4>
              <p className="text-sm text-slate-600 mt-1">
                Enter your administrator passkey to manage Nigerian depots, distributor applications,
                and configurable contact settings. (Default demo passkey:{' '}
                <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                  LABAN-ADMIN-2026
                </code>
                )
              </p>
            </div>

            {authError && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {authError}
              </p>
            )}

            <div>
              <label htmlFor="admin-passkey" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Passkey
              </label>
              <input
                id="admin-passkey"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter administrator passkey"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#35105F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D]"
            >
              Unlock Portal
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'depots', label: `Depots (${depots.length})` },
                    { id: 'distributors', label: `Distributors (${distributors.length})` },
                    {
                      id: 'enquiries',
                      label: `Contacts & Settings (${contacts.length + productEnquiries.length})`,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#35105F] text-white'
                        : 'bg-slate-100 text-slate-700 hover:text-[#21063D]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {loadingData && <span className="text-xs text-slate-500">Refreshing records...</span>}
            </div>

            {actionError && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl p-3">
                {actionError}
              </p>
            )}
            {actionNotice && (
              <p className="text-sm text-[#21063D] bg-[#C8F52C]/30 border border-[#C8F52C] rounded-xl p-3 font-medium">
                {actionNotice}
              </p>
            )}

            {activeTab === 'depots' && (
              <div className="space-y-8">
                <form
                  onSubmit={handleSaveDepot}
                  className="bg-[#FAFAFC] border border-slate-200 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-base font-bold text-[#21063D]">
                      {editingDepotId ? 'Edit Depot / Coverage Entry' : 'Add Confirmed Depot or Coverage Location'}
                    </h4>
                    {editingDepotId && (
                      <button
                        type="button"
                        onClick={resetDepotForm}
                        className="text-xs font-semibold text-slate-600 hover:underline"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                      <select
                        value={depotState}
                        onChange={(e) => setDepotState(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Depot / Desk Name *</label>
                      <input
                        type="text"
                        required
                        value={depotName}
                        onChange={(e) => setDepotName(e.target.value)}
                        placeholder="e.g. Abeokuta Regional Depot"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Classification *</label>
                      <select
                        value={depotType}
                        onChange={(e) => setDepotType(e.target.value as DepotType)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        <option value="confirmed_depot">Confirmed Operational Depot</option>
                        <option value="coverage_location">Coverage / Enquiry Location</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Coverage Note *</label>
                      <input
                        type="text"
                        required
                        value={depotAddress}
                        onChange={(e) => setDepotAddress(e.target.value)}
                        placeholder="Full depot address or dispatch instructions"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={depotPhone}
                        onChange={(e) => setDepotPhone(e.target.value)}
                        placeholder="+234 ..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours *</label>
                      <input
                        type="text"
                        required
                        value={depotHours}
                        onChange={(e) => setDepotHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Status *</label>
                      <select
                        value={depotStatus}
                        onChange={(e) => setDepotStatus(e.target.value as AvailabilityStatus)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        <option value="Operational">Operational</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Coverage / Enquiry">Coverage / Enquiry</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D]"
                      >
                        <Plus className="w-4 h-4" />
                        {editingDepotId ? 'Save Changes' : 'Add Depot Entry'}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-2.5">
                  {depots.map((d) => (
                    <div
                      key={d.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white text-sm"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#21063D]">
                          {d.state} — {d.depotName}{' '}
                          <span className="font-normal text-xs text-slate-500">
                            ({d.depotType === 'confirmed_depot' ? 'Confirmed Depot' : 'Coverage Location'})
                          </span>
                        </p>
                        <p className="text-xs text-slate-600">
                          {d.address} · {d.phone} · {d.operatingHours}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditDepot(d)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#35105F] hover:bg-slate-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDepot(d.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'distributors' && (
              <div className="space-y-4">
                {distributors.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">
                    No distributor applications submitted yet.
                  </p>
                ) : (
                  distributors.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-sm"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-[#21063D]">
                          {app.businessName}{' '}
                          <span className="font-mono text-xs text-slate-400">({app.id})</span>
                        </p>
                        <p className="text-slate-600">
                          {app.fullName} · {app.state} ({app.businessLocation})
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          {app.phone} · {app.email}
                        </p>
                        <p className="text-slate-700 pt-1">{app.message}</p>
                      </div>
                      <select
                        value={app.status}
                        onChange={(e) => handleDistributorStatus(app.id, e.target.value as ApplicationStatus)}
                        aria-label={`Status for ${app.businessName}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-[#FAFAFC] shrink-0"
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div className="space-y-8">
                {config && (
                  <form
                    onSubmit={handleSaveConfig}
                    className="bg-[#FAFAFC] border border-slate-200 rounded-2xl p-5 space-y-4"
                  >
                    <h4 className="font-display text-base font-bold text-[#21063D]">
                      Configurable Company Contact Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone</label>
                        <input
                          type="text"
                          value={config.phone}
                          onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          WhatsApp Number (digits only)
                        </label>
                        <input
                          type="text"
                          value={config.whatsapp}
                          onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
                        <input
                          type="email"
                          value={config.email}
                          onChange={(e) => setConfig({ ...config, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Business Hours</label>
                        <input
                          type="text"
                          value={config.businessHours}
                          onChange={(e) => setConfig({ ...config, businessHours: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
                        <input
                          type="text"
                          value={config.officeAddress}
                          onChange={(e) => setConfig({ ...config, officeAddress: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#35105F] text-white text-sm font-bold hover:bg-[#21063D]"
                    >
                      Save Contact Settings
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  <h4 className="font-display text-base font-bold text-[#21063D]">
                    Product Enquiries ({productEnquiries.length})
                  </h4>
                  {productEnquiries.length === 0 ? (
                    <p className="text-sm text-slate-500">No product enquiries recorded yet.</p>
                  ) : (
                    productEnquiries.map((pe) => (
                      <div key={pe.id} className="p-4 rounded-xl border border-slate-200 bg-white text-sm space-y-1">
                        <p className="font-bold text-[#21063D]">
                          {pe.productName} ({pe.bottleSize}) · {pe.enquiryType}
                        </p>
                        <p className="text-slate-600">
                          {pe.name} · {pe.state} · {pe.phone} · {pe.email}
                        </p>
                        {pe.notes && <p className="text-slate-700">{pe.notes}</p>}
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-display text-base font-bold text-[#21063D]">
                    Contact Messages ({contacts.length})
                  </h4>
                  {contacts.length === 0 ? (
                    <p className="text-sm text-slate-500">No contact messages submitted yet.</p>
                  ) : (
                    contacts.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between gap-4 text-sm"
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-[#21063D]">{msg.subject}</p>
                          <p className="text-slate-600">
                            {msg.name} · {msg.email} {msg.phone ? `· ${msg.phone}` : ''}
                          </p>
                          <p className="text-slate-700">{msg.message}</p>
                        </div>
                        <select
                          value={msg.status}
                          onChange={(e) => handleContactStatus(msg.id, e.target.value as ContactStatus)}
                          aria-label={`Status for ${msg.subject}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-[#FAFAFC] h-fit"
                        >
                          <option value="Unread">Unread</option>
                          <option value="Responded">Responded</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
