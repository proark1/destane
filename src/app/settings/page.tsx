/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const notificationDefaults = [
  { label: "Investment Updates", description: "Portfolio changes and dividend payouts", enabled: true },
  { label: "Production Milestones", description: "Status changes for your productions", enabled: true },
  { label: "Market Alerts", description: "Token price movements and volume spikes", enabled: false },
  { label: "Compliance Reminders", description: "KYC expiry and document requests", enabled: true },
];

const wallets = [
  { name: "MetaMask", address: "0x7a3b...4f2e", chain: "Ethereum", connected: true },
  { name: "Phantom", address: "Hk9v...m2Qx", chain: "Solana", connected: false },
];

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [notifications, setNotifications] = useState(notificationDefaults);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setDisplayName(data.user.username || "");
          setEmail(data.user.email || "");
          setBio(data.user.bio || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: displayName, email, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save profile" });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function handlePasswordChange() {
    setPasswordError("");
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword) { setPasswordError("Both fields are required"); return; }
    if (newPassword.length < 8) { setPasswordError("New password must be at least 8 characters"); return; }

    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.error); return; }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(false); }, 2000);
    } catch {
      setPasswordError("Network error");
    }
  }

  function toggleNotification(index: number) {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  }

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
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/20">
              <img src="/images/ui/empty-avatar.svg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface font-[family-name:var(--font-plus-jakarta)]">
                {loading ? "Loading..." : displayName || "User"}
              </p>
              <p className="text-xs text-on-surface-variant">Premium Tier Investor</p>
            </div>
          </div>

          {message && (
            <div className={`mb-5 p-3 rounded-lg text-xs font-medium ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-error-container/20 border border-error/30 text-error"
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-widest text-on-surface-variant/60 block mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm text-on-surface focus:outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-gold text-on-primary font-[family-name:var(--font-inter)] text-xs font-bold px-5 py-2.5 rounded-md shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
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
            <div className="py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium">Password</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">Change your account password</p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="border border-outline-variant/30 text-on-surface font-[family-name:var(--font-inter)] text-xs font-medium px-4 py-2 rounded-md hover:border-primary/40 transition-colors"
                >
                  {showPasswordForm ? "Cancel" : "Change Password"}
                </button>
              </div>
              {showPasswordForm && (
                <div className="bg-surface-container-lowest rounded-lg p-4 space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New password (min 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-md px-3 py-2 text-sm text-on-surface focus:border-primary/40 focus:ring-0 focus:outline-none"
                  />
                  {passwordError && <p className="text-error text-xs">{passwordError}</p>}
                  {passwordSuccess && <p className="text-green-400 text-xs">Password changed successfully!</p>}
                  <button
                    onClick={handlePasswordChange}
                    className="btn-gold text-on-primary font-bold text-xs px-4 py-2 rounded-md"
                  >
                    Update Password
                  </button>
                </div>
              )}
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
            {notifications.map((n, i) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium">{n.label}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant mt-0.5">{n.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(i)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${n.enabled ? "bg-primary" : "bg-surface-container-highest"}`}
                >
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
