import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-[#3B82F6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-[#1E293B] shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#14F195] to-[#3B82F6] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-[#0A0F1E]" />
            </div>
            <span className="text-2xl font-black text-[#F8FAFC] tracking-wider">SpendX</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Create Your Account</h2>
          <p className="text-xs text-[#94A3B8]">Start tracking shared & personal finances today.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Password</label>
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

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#14F195]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#14F195] hover:bg-[#10d482] text-[#0A0F1E] font-extrabold text-sm transition-all shadow-lg shadow-[#14F195]/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#94A3B8] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#14F195] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
