import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, BriefcaseIcon, UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    matricNoOrStaffId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 md:p-8">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
          <AcademicCapIcon className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Sign up to get started with your campus portal</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Jane Doe"
                required
              />
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm"
                placeholder="you@university.edu"
                required
              />
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter password"
                required
                minLength={8}
              />
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Role</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'student'})}
                className={`flex-1 flex justify-center items-center gap-2 py-3 border rounded-xl text-sm font-semibold transition ${formData.role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <AcademicCapIcon className="w-5 h-5" /> Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'staff'})}
                className={`flex-1 flex justify-center items-center gap-2 py-3 border rounded-xl text-sm font-semibold transition ${formData.role === 'staff' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <BriefcaseIcon className="w-5 h-5" /> Staff
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Matric No / Staff ID <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="matricNoOrStaffId"
                value={formData.matricNoOrStaffId}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm"
                placeholder="UG22/0000/0000"
              />
              <IdentificationIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 mt-4 transition"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold">
            Log In
          </Link>
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-gray-400 max-w-xs">
        By registering you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default Register;
