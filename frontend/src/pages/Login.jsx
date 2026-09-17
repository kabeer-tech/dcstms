import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        
        {/* Updated Header matching your original UI */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">DCSTMS</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Ticket Management System</p>
          
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-sm font-medium text-gray-500">Sign in to continue to your workspace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm font-bold p-4 rounded-2xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-sm font-bold text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm transition mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : (
              <>
                Log in <span aria-hidden="true">&rarr;</span>
              </>
            )}
          </button>
        </form>

        {/* Missing Registration Link Added Here */}
        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm font-medium text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition">
              Create one now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
