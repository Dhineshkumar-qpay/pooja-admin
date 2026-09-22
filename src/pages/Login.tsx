import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldCheck, BarChart3, Package } from 'lucide-react';
import { authService } from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'VERIFY'>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.login(email);
      if (response.status === 200) {
        setStep('VERIFY');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.verify(email, otp);
      if (response.status === 200 && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userid', response.data.userid);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-brown-900 via-dark-brown-800 to-dark-brown-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-saffron-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-temple-gold-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-saffron-500/5 blur-2xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron-500 to-temple-gold-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl leading-none">P</span>
          </div>
          <span className="text-white font-heading font-bold text-xl tracking-tight">Pooja Admin</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-heading font-bold text-white leading-tight">
              Manage your<br />
              <span className="bg-gradient-to-r from-saffron-400 to-temple-gold-400 bg-clip-text text-transparent">
                sacred store
              </span>
            </h2>
            <p className="mt-4 text-dark-brown-300 text-sm leading-relaxed max-w-xs">
              A complete admin platform to manage products, orders, and customers for your pooja essentials business.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: Package, label: 'Products & Inventory' },
              { icon: BarChart3, label: 'Sales & Reports' },
              { icon: ShieldCheck, label: 'Secure & Reliable' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-temple-gold-400" />
                </div>
                <span className="text-dark-brown-200 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative flex items-center gap-2">
          <Flame className="h-4 w-4 text-saffron-500" />
          <span className="text-dark-brown-400 text-xs">Crafted for devotion & commerce</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-ivory-50 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-saffron-500 to-temple-gold-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg leading-none">P</span>
            </div>
            <span className="text-dark-brown-900 font-heading font-bold text-xl">Pooja Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-dark-brown-900">Welcome back</h1>
            <p className="text-dark-brown-400 text-sm mt-1.5">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={step === 'LOGIN' ? handleLogin : handleVerify} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-brown-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={step === 'VERIFY'}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-dark-brown-200 bg-white text-dark-brown-900 placeholder-dark-brown-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all disabled:opacity-50"
              />
            </div>

            {step === 'VERIFY' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-dark-brown-700">OTP</label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl border border-dark-brown-200 bg-white text-dark-brown-900 placeholder-dark-brown-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-600 to-temple-gold-500 text-white font-semibold text-sm shadow-lg shadow-saffron-600/20 hover:shadow-saffron-600/30 hover:opacity-95 active:scale-[0.99] transition-all mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (step === 'LOGIN' ? 'Send OTP' : 'Verify & Sign In')}
            </button>
            
            {step === 'VERIFY' && (
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep('LOGIN')} 
                  className="text-xs text-saffron-600 hover:text-saffron-700 font-medium transition-colors"
                >
                  Change Email
                </button>
              </div>
            )}
          </form>

          <p className="text-center text-xs text-dark-brown-400 mt-8">
            © {new Date().getFullYear()} Pooja Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
