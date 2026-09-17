import { useState, useEffect } from 'react';
import api from '../services/api';
import { TrashIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await api.get('/faqs');
      setFaqs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/faqs', { question, answer });
      setFaqs([res.data.data, ...faqs]);
      setQuestion('');
      setAnswer('');
    } catch (error) {
      console.error('Failed to create FAQ:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-bold text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <QuestionMarkCircleIcon className="w-8 h-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage FAQs</h1>
          <p className="text-sm font-medium text-gray-500">Create new answers or remove outdated ones.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Question</label>
          <input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 transition"
            placeholder="e.g. How do I request a new ID card?"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Answer</label>
          <textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="3"
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 transition"
            placeholder="Provide a clear, helpful answer..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting || !question || !answer}
          className="bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2 shadow-sm"
        >
          <PlusIcon className="w-5 h-5" strokeWidth={2.5} />
          {submitting ? 'Publishing...' : 'Publish FAQ'}
        </button>
      </form>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden p-2">
        {faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No FAQs added yet. Use the form above to create one.</div>
        ) : (
          faqs.map((faq) => (
            <div key={faq._id} className="border-b border-gray-50 last:border-0 p-4 flex justify-between gap-4 items-start hover:bg-gray-50 transition rounded-xl m-1">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{faq.question}</h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-2">{faq.answer}</p>
              </div>
              <button
                onClick={() => handleDelete(faq._id)}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0"
                title="Delete FAQ"
              >
                <TrashIcon className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageFAQs;
