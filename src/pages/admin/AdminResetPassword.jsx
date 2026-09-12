import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Lock, Mail, Fish, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (resetToken) {
        await base44.auth.resetPassword({ resetToken, newPassword });
        setSuccess(true);
      } else {
        await base44.auth.resetPasswordRequest(email);
        setSuccess(true);
      }
    } catch (err) {
      setError(err?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {resetToken ? 'Password Reset Successfully' : 'Reset Link Sent'}
          </h2>
          <p className="text-slate-400 mb-6">
            {resetToken
              ? 'Your password has been updated. You can now sign in with your new password.'
              : 'If an account exists with that email, a reset link has been sent.'}
          </p>
          <a href="/admin/login" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/20 border border-blue-400/30 mb-4">
            <Fish className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Admin Password</h1>
          <p className="text-sm text-slate-400 mt-1">
            {resetToken ? 'Enter your new password' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!resetToken && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            )}

            {resetToken && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>{resetToken ? 'Reset Password' : 'Send Reset Link'} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}