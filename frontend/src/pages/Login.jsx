import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4 md:p-8">
      <div className="w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3.5 rounded-2xl shadow-lg shadow-blue-600/20 mb-5">
            <ShieldCheckIcon className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">DCSTMS</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Ticket Management System</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm font-medium mb-8">Sign in to continue to your workspace.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium shadow-sm"
                  placeholder="you@company.com"
                  required
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-medium shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-bold transition">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 active:bg-blue-800 transition shadow-sm mt-4 flex items-center justify-center gap-2"
            >
              Log In
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold transition">
            Create one now
          </Link>
        </p>

        <div className="mt-12 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
          <LockClosedIcon className="w-3.5 h-3.5" />
          Secured with 256-bit encryption
        </div>

      </div>
    </div>
  );
};

export default Login;