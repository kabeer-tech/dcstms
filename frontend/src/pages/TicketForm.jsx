import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeftIcon, ExclamationCircleIcon, HandRaisedIcon } from '@heroicons/react/24/outline';

const TicketForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
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
    <div className="max-w-4xl pb-10">
      <div className="flex items-center gap-2 mb-2 text-blue-600 text-sm font-bold cursor-pointer w-max hover:text-blue-700" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="w-4 h-4" /> Create a new request
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-1">Submit New Ticket</h1>
      <p className="text-gray-500 text-sm font-medium mb-8">Fill in the details below and our team will get back to you shortly.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Ticket Type</label>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full max-w-md">
            <button
              type="button"
              onClick={() => setFormData({...formData, ticketType: 'complaint'})}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${formData.ticketType === 'complaint' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className={`w-2 h-2 rounded-full ${formData.ticketType === 'complaint' ? 'bg-blue-600' : 'bg-transparent'}`}></div>
              <ExclamationCircleIcon className="w-5 h-5" /> Complaint
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, ticketType: 'service_request'})}
              className={`flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${formData.ticketType === 'service_request' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className={`w-2 h-2 rounded-full ${formData.ticketType === 'service_request' ? 'bg-blue-600' : 'bg-transparent'}`}></div>
              <HandRaisedIcon className="w-5 h-5" /> Service Request
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Subject / Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Briefly summarize your request (e.g., Broken projector in Hall C)"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 shadow-sm"
            required
            maxLength={100}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none font-bold text-gray-700 shadow-sm"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="IT Support">IT Support</option>
              <option value="Facilities">Facilities</option>
              <option value="Registrar">Registrar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Priority</label>
            <div className="flex gap-4">
              {[
                { id: 'low', color: 'bg-green-500' },
                { id: 'medium', color: 'bg-blue-500' },
                { id: 'high', color: 'bg-orange-500' },
                { id: 'urgent', color: 'bg-red-500' }
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p.id}
                    checked={formData.priority === p.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-full ${p.color} ring-4 ${formData.priority === p.id ? 'ring-gray-100' : 'ring-transparent'} transition-all`}></div>
                  <span className={`text-xs font-bold capitalize ${formData.priority === p.id ? 'text-gray-900' : 'text-gray-500'}`}>{p.id}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2 flex justify-between">
            Description <span className="text-gray-400 font-medium">{charCount}/500</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Describe your issue in detail..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium resize-none shadow-sm"
            required
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Attachments <span className="text-gray-400 font-medium">(optional)</span></label>
          <div className="bg-blue-500 rounded-2xl p-10 text-center cursor-pointer hover:bg-blue-600 transition shadow-sm">
            <p className="text-sm font-bold text-white mb-1">Drag & drop files or click to browse</p>
            <p className="text-xs text-blue-200 font-medium">Max upload size: 10MB</p>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="block text-sm font-bold text-gray-900">Submit anonymously</span>
            <span className="block text-xs font-medium text-gray-500">Your name will be hidden from the assignee.</span>
          </div>
        </label>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 max-w-[200px] bg-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 shadow-sm flex justify-center items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 max-w-[200px] bg-white text-gray-900 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 shadow-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
