import { useState, useEffect } from 'react';
import api from '../services/api';
import { QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

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

  if (loading) return <div className="p-8 text-center text-sm font-bold text-gray-500 animate-pulse">Loading FAQs...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <QuestionMarkCircleIcon className="w-8 h-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h1>
          <p className="text-sm font-medium text-gray-500">Find answers to common issues and platform questions.</p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-2">
        {faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-medium">No FAQs available yet.</div>
        ) : (
          faqs.map((faq) => (
            <div key={faq._id} className="border-b border-gray-50 last:border-0">
              <button
                onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
              >
                <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openId === faq._id ? 'rotate-180 text-blue-600' : ''}`} strokeWidth={2.5} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-5 text-gray-600 text-sm font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQ;
