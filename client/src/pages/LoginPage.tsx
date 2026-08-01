import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@spendx.com', 'demo123');
      navigate('/dashboard');
    } catch {
      try {
        await login('alex@spendx.com', 'password123');
        navigate('/dashboard');
      } catch (err: any) {
        setError('Could not auto-login demo. Please register a new account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#14F195]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-[#1E293B] shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14F195] to-[#3B82F6] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-[#0A0F1E]" />
            </div>
            <span className="text-2xl font-black text-[#F8FAFC] tracking-wider">SpendX</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Welcome Back</h2>
          <p className="text-xs text-[#94A3B8]">Sign in to access your personal & family finances.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(!showForgot)}
                className="text-[11px] text-[#14F195] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
              />
            </div>
          </div>

          {showForgot && (
            <div className="p-3 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#3B82F6] text-xs">
              Password recovery link instructions sent to email. Contact support for reset token.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-all shadow-lg shadow-[#14F195]/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#1E293B] w-full" />
          <span className="bg-[#111827] px-3 text-[10px] uppercase font-bold text-[#94A3B8] absolute">Or</span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-[#8B5CF6] font-extrabold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> One-Click Demo Login
        </button>

        <p className="text-center text-xs text-[#94A3B8] pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#14F195] font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
