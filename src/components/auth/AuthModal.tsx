import React, { useState } from 'react';
import { X, Mail, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mode: 'login' | 'signup', email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(mode, email || 'demo.owner@bizhubke.co.ke');
  };

  const handleGoogleAuth = () => {
    onSuccess(mode, 'google.user@gmail.com');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#0B2440] text-white p-6 text-center space-y-1">
          <span className="text-2xl font-bold tracking-tight">
            BizHub<span className="text-[#F5B400]">KE</span>
          </span>
          <h3 className="text-base font-semibold text-slate-200">
            {mode === 'signup' ? 'Create Your SME Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'signup'
              ? 'Start your 7-day full access free trial • No card required'
              : 'Sign in to access your sales, invoices, and stock'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Google Sign-in simulation */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 uppercase font-medium">Or with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@business.co.ke"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0F7A4C] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-[#F5B400] hover:bg-[#d99f00] shadow transition-transform transform hover:-translate-y-0.5 mt-2"
            >
              {mode === 'signup' ? 'Start Free Trial →' : 'Sign In to Dashboard →'}
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'signup' ? (
              <p>
                Already have a BizHubKE account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#0F7A4C] font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#0F7A4C] font-bold hover:underline"
                >
                  Create Free Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
