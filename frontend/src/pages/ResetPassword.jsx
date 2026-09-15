import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match!' });
    }
    if (formData.password.length < 6) {
      return setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      await api.patch(`/auth/reset-password/${token}`, { password: formData.password });
      setStatus({ type: 'success', message: 'Password successfully reset! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Invalid or expired reset token.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <LockClosedIcon className="w-8 h-8" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Create New Password</h1>
          <p className="text-sm font-medium text-gray-500">
            Please enter your new password below. Make sure it's strong and secure!
          </p>
        </div>

        {status.message && (
          <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-bold border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {status.type === 'success' ? <CheckCircleIcon className="w-5 h-5 shrink-0" /> : <ExclamationCircleIcon className="w-5 h-5 shrink-0" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.password || !formData.confirmPassword || status.type === 'success'}
            className="w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm transition"
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
