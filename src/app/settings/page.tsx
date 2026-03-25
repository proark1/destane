import DashboardLayout from "@/components/DashboardLayout";
import { getSession } from "@/lib/auth";

const notifications = [
  { label: "Investment Updates", description: "Portfolio changes and dividend payouts", enabled: true },
  { label: "Production Milestones", description: "Status changes for your productions", enabled: true },
  { label: "Market Alerts", description: "Token price movements and volume spikes", enabled: false },
  { label: "Compliance Reminders", description: "KYC expiry and document requests", enabled: true },
];

const wallets = [
  { name: "MetaMask", address: "0x7a3b...4f2e", chain: "Ethereum", connected: true },
  { name: "Phantom", address: "Hk9v...m2Qx", chain: "Solana", connected: false },
];

export default async function SettingsPage() {
  const user = await getSession();
  const displayName = user?.username ?? "User";
  const email = user?.email ?? "user@destane.io";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
              Account Configuration
            </p>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-4xl font-extrabold tracking-tighter">
              Platform Settings
            </h1>
          </div>
          <span className="flex items-center gap-2 bg-green-500/10 text-green-400 font-[family-name:var(--font-inter)] text-[10px] font-bold px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span className="material-symbols-outlined text-sm">verified</span>
            Identity Verified
          </span>
        </div>

        {/* Personal Profile */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">person</span>
            Personal Profile
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Display Name</label>
                <input
                  type="text"
                  defaultValue={displayName}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  defaultValue={email}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Bio</label>
              <textarea
                rows={3}
                defaultValue="Entertainment investor and producer focused on emerging digital media."
                className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20">
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">shield</span>
            Security
          </h3>
          <div className="space-y-5">
            {/* 2FA Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-outline-variant/10">
              <div>
                <p className="font-[family-name:var(--font-inter)] text-sm font-medium">Two-Factor Authentication</p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">Add an extra layer of security with TOTP</p>
              </div>
              <button className="relative w-11 h-6 bg-primary rounded-full transition-colors">
                <span className="absolute top-0.5 left-5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
            {/* Password Change */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-[family-name:var(--font-inter)] text-sm font-medium">Password</p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">Last changed 42 days ago</p>
              </div>
              <button className="border border-outline-variant/30 text-on-surface font-[family-name:var(--font-inter)] text-xs font-medium px-4 py-2 rounded-md hover:border-primary/40 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">notifications</span>
            Notification Preferences
          </h3>
          <div className="space-y-1">
            {notifications.map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium">{n.label}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">{n.description}</p>
                </div>
                <button className={`relative w-11 h-6 rounded-full transition-colors ${n.enabled ? "bg-primary" : "bg-surface-container-highest"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${n.enabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Wallets */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              Connected Wallets
            </h3>
            <button className="border border-outline-variant/30 text-on-surface font-[family-name:var(--font-inter)] text-xs font-medium px-4 py-2 rounded-md hover:border-primary/40 transition-colors">
              + Add Wallet
            </button>
          </div>
          <div className="space-y-3">
            {wallets.map((w) => (
              <div key={w.name} className="flex items-center justify-between py-3 px-4 bg-surface-container-highest/20 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">wallet</span>
                  <div>
                    <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold">{w.name}</p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-on-surface-variant">
                      {w.address} &middot; {w.chain}
                    </p>
                  </div>
                </div>
                <span className={`font-[family-name:var(--font-inter)] text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  w.connected ? "bg-green-500/10 text-green-400" : "bg-surface-container-highest/50 text-on-surface-variant/40"
                }`}>
                  {w.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
