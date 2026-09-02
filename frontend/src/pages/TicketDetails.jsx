import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  TagIcon, 
  BriefcaseIcon, 
  PlusCircleIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  GlobeAltIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

const statusMap = {
  submitted: { label: 'Open', class: 'bg-blue-500 text-white' },
  in_review: { label: 'Pending', class: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolved', class: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', class: 'bg-gray-100 text-gray-700' },
};

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  // Fetch staff list for assignment (only if staff/admin)
  useEffect(() => {
    if (user?.role === 'staff' || user?.role === 'admin') {
      api.get('/users/staff')
        .then(res => setStaffList(res.data.data))
        .catch(err => console.error('Failed to fetch staff:', err));
    }
  }, [user]);

  useEffect(() => {
    const fetchTicketAndComments = async () => {
      try {
        const [ticketRes, commentsRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get(`/comments/${id}`)
        ]);
        setTicket(ticketRes.data.data);
        setComments(commentsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/comments/${id}`, {
        message: comment,
        visibility: user?.role === 'student' ? 'public' : visibility,
      });
      setComment('');
      const res = await api.get(`/comments/${id}`);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!selectedStaff) return;
    try {
      await api.patch(`/tickets/${id}/status`, { assignedTo: selectedStaff });
      // Refresh ticket data
      const ticketRes = await api.get(`/tickets/${id}`);
      setTicket(ticketRes.data.data);
      setSelectedStaff('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10 font-medium text-gray-500">Loading...</div>;
  if (!ticket) return <div className="text-center py-10 font-medium text-gray-500">Ticket not found</div>;

  const status = statusMap[ticket.status] || { label: ticket.status, class: 'bg-gray-100' };
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeftIcon className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">#{ticket.ticketNumber}</h1>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.class}`}>
          {status.label}
        </span>
        <span className="text-xs font-bold text-red-500 flex items-center gap-1 ml-auto">
          🔥 {ticket.priority}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{ticket.description.split('.')[0]}...</h2>
        
        <div className="flex gap-2 mb-6">
          <span className="flex items-center gap-1 bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">
            <TagIcon className="w-3.5 h-3.5" /> {ticket.ticketType === 'complaint' ? 'Bug Report' : 'Service'}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">
            <BriefcaseIcon className="w-3.5 h-3.5" /> {ticket.department?.name || 'Engineering'}
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.assignedTo?.name || 'unassigned'}`} alt="avatar" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Assigned to</p>
              <p className="text-sm font-bold text-gray-900">{ticket.assignedTo?.name || 'Unassigned'}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-8">
          {ticket.description}
        </p>

        <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <PlusCircleIcon className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4">
              <p className="text-sm font-bold text-gray-900">Created</p>
              <p className="text-xs font-medium text-gray-500">{new Date(ticket.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <ArrowPathIcon className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4">
              <p className="text-sm font-bold text-gray-900">Updated</p>
              <p className="text-xs font-medium text-gray-500">{new Date(ticket.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4">
              <p className="text-sm font-bold text-gray-400">Resolved</p>
              <p className="text-xs font-medium text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {isStaff && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Staff Actions</h3>
          </div>
          
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
              >
                <option value="submitted">Open</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign to Staff</label>
              <div className="flex gap-2">
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
                >
                  <option value="">Select staff...</option>
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.department?.name || 'No dept'})</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedStaff}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleStatusUpdate('resolved')}
              className="flex-1 bg-teal-500 text-white font-bold text-sm py-3 rounded-xl hover:bg-teal-600 transition flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" /> Resolve
            </button>
            <button
              onClick={() => handleStatusUpdate('closed')}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5" /> Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Comments
          </h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{comments.length}</span>
        </div>

        <div className="space-y-6 mb-6">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.name}`} alt="avatar" className="w-10 h-10 rounded-full bg-gray-100" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-gray-900">{c.author?.name}</span>
                  <span className="text-xs font-medium text-gray-400">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1">{c.message}</p>
                <div className="mt-2">
                  {c.visibility === 'internal' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-blue-600"><LockClosedIcon className="w-3.5 h-3.5" /></div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-blue-600"><GlobeAltIcon className="w-3.5 h-3.5" /></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit} className="relative">
          {isStaff && (
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <EyeIcon className="w-4 h-4" /> Visibility
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${visibility === 'public' ? 'text-gray-900' : 'text-gray-400'}`}>Public</span>
                <button
                  type="button"
                  onClick={() => setVisibility(v => v === 'public' ? 'internal' : 'public')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${visibility === 'internal' ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${visibility === 'internal' ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
                <span className={`text-xs font-bold ${visibility === 'internal' ? 'text-gray-900' : 'text-gray-400'}`}>Internal</span>
              </div>
            </div>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition resize-none pb-14"
            rows="3"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="absolute bottom-3 right-3 bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
