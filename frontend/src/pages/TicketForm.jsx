import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const TicketForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ticketType: 'complaint',
    category: '',
    description: '',
    department: '6a95afb667c86109ea0a9d9a',
    priority: 'medium',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'description') setCharCount(value.length);
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', formData);
      navigate('/tickets');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Submit New Ticket</h1>
      <p className="text-gray-500 text-sm mb-8">Fill in the details below and our team will get back to you shortly.</p>

      <form onSubmit={handleSubmit} className="space-y-7">
        
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Ticket Type</label>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({...formData, ticketType: 'complaint'})}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.ticketType === 'complaint' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ExclamationCircleIcon className="w-5 h-5" /> Complaint
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, ticketType: 'service_request'})}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.ticketType === 'service_request' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Service Request
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm appearance-none font-medium text-gray-700"
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="IT Support">IT Support</option>
            <option value="Facilities">Facilities</option>
            <option value="Registrar">Registrar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your issue in detail..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition text-sm resize-none"
            required
            maxLength={500}
          />
          <div className="flex justify-between text-xs mt-1.5 font-medium">
            <span className="text-red-500">{charCount === 0 && 'Description is required.'}</span>
            <span className="text-gray-400 ml-auto">{charCount}/500</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Priority</label>
          <div className="flex justify-between max-w-sm">
            {[
              { id: 'low', color: 'bg-green-500' },
              { id: 'medium', color: 'bg-yellow-500' },
              { id: 'high', color: 'bg-orange-500' },
              { id: 'urgent', color: 'bg-red-500' }
            ].map((p) => (
              <label key={p.id} className="flex flex-col items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p.id}
                  checked={formData.priority === p.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full ${p.color} ring-4 ${formData.priority === p.id ? 'ring-gray-200' : 'ring-transparent'} transition-all`}></div>
                <span className="text-xs font-semibold capitalize text-gray-700">{p.id}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Attachments <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition">
            <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 mb-1">Drag & drop files or tap to browse</p>
            <p className="text-xs text-gray-500 font-medium">PNG, JPG or PDF up to 10MB</p>
          </div>
        </div>

        <label className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 transition">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
          />
          <div>
            <span className="block text-sm font-bold text-gray-900">Submit anonymously</span>
            <span className="block text-xs font-medium text-gray-500 mt-0.5">Your name will be hidden from the assignee.</span>
          </div>
        </label>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
