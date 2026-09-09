import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const statusMap = {
  submitted: { label: 'Open', class: 'bg-blue-100 text-blue-700' },
  in_review: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'Resolved', class: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', class: 'bg-gray-100 text-gray-700' },
};

const priorityMap = {
  low: { label: 'Low', class: 'text-gray-500' },
  medium: { label: 'Medium', class: 'text-blue-500' },
  high: { label: 'High', class: 'text-orange-500' },
  urgent: { label: 'Urgent', class: 'text-red-500' },
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
        if (user?.role === 'staff' || user?.role === 'admin') {
          setSelectedStaff(ticketRes.data.data.assignedTo?._id || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketAndComments();
  }, [id, user]);

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
      const ticketRes = await api.get(`/tickets/${id}`);
      setTicket(ticketRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading...</div>;
  if (!ticket) return <div className="text-center py-20 font-medium text-gray-500">Ticket not found</div>;

  const status = statusMap[ticket.status] || { label: ticket.status, class: 'bg-gray-100 text-gray-700' };
  const priority = priorityMap[ticket.priority] || { label: ticket.priority, class: 'text-gray-500' };
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  return (
    <div className="pb-10 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition">
            <ArrowLeftIcon className="w-4 h-4" /> Tickets
          </button>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-900 font-bold text-sm truncate max-w-[120px] md:max-w-none">#{ticket.ticketNumber}</span>
        </div>
        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
          Updated {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight break-all">#{ticket.ticketNumber}</h1>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap ${status.class}`}>
              {status.label}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap ${priority.class}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              {ticket.priority}
            </span>
          </div>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 break-words">{ticket.description.split('.')[0]}...</h2>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <TagIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {ticket.ticketType === 'complaint' ? 'Bug Report' : 'Service'}
          </span>
          <span className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <BriefcaseIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {ticket.department?.name || 'Engineering'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-2 p-5 md:p-6 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-900">Ticket information</h3>
              <span className="text-xs font-bold text-gray-400">Submitted {new Date(ticket.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
            </div>
            
            <div className="p-5 md:p-8">
              <div className="bg-gray-50 rounded-2xl p-4 md:p-5 flex flex-wrap justify-between items-center gap-4 mb-8 border border-gray-100">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border border-white shadow-sm shrink-0">
                    {ticket.assignedTo?.name ? ticket.assignedTo.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'SC'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Assigned to</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{ticket.assignedTo?.name || 'Unassigned'}</p>
                  </div>
                </div>
                {isStaff && <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition whitespace-nowrap">Change</button>}
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Description</p>
                <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap break-words">
                  {ticket.description}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-5">Activity timeline</p>
                <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100">
                  <div className="relative flex items-start group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white shrink-0 shadow-sm z-10 -ml-2.5 mt-0.5">
                      <PlusCircleIcon className="w-4 h-4" />
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Created</p>
                      <p className="text-xs font-medium text-gray-500 mt-1 break-words">{new Date(ticket.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-start group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 shrink-0 z-10 -ml-2.5 mt-0.5">
                      <ArrowPathIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Updated</p>
                      <p className="text-xs font-medium text-gray-500 mt-1 break-words">{new Date(ticket.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {ticket.status === 'resolved' || ticket.status === 'closed' ? (
                    <div className="relative flex items-start group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shrink-0 shadow-sm z-10 -ml-2.5 mt-0.5">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-bold text-gray-900">Resolved</p>
                        <p className="text-xs font-medium text-gray-500 mt-1 break-words">Ticket completed</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start group opacity-50">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 shrink-0 z-10 -ml-2.5 mt-0.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-bold text-gray-500">Resolved-pending</p>
                        <p className="text-xs font-medium text-gray-400 mt-1 break-words">Awaiting confirmation</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isStaff && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8">
              <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" /> Staff Actions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none p-3.5 shadow-sm"
                  >
                    <option value="submitted">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Assign to Staff</label>
                  <div className="flex gap-2">
                    <select 
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none p-3.5 shadow-sm min-w-0"
                    >
                      <option value="">Unassigned</option>
                      {staffList.map(staff => (
                        <option key={staff._id} value={staff._id}>{staff.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={!selectedStaff}
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 shadow-sm shrink-0"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  className="flex-1 bg-teal-500 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-teal-600 shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <CheckCircleIcon className="w-5 h-5 shrink-0" /> Resolve
                </button>
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-3.5 rounded-xl hover:bg-gray-50 shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <ArrowPathIcon className="w-5 h-5 shrink-0" /> Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-24">
          <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-50">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" /> Comments
            </h3>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">{comments.length}</span>
          </div>

          <div className="flex-1 p-5 md:p-6 space-y-6 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm font-medium text-gray-500 text-center py-4">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                    {c.author?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-baseline gap-1 mb-1">
                      <span className="font-bold text-sm text-gray-900 mr-2 truncate">{c.author?.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-2 leading-relaxed bg-gray-50 p-3 rounded-2xl rounded-tl-none break-words">{c.message}</p>
                    {c.visibility === 'internal' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded"><LockClosedIcon className="w-3 h-3" /> Internal</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500"><GlobeAltIcon className="w-3 h-3" /> Public</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 md:p-6 border-t border-gray-50 bg-gray-50/50 mt-auto">
            <form onSubmit={handleCommentSubmit}>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-900">Add a comment</span>
                {isStaff && (
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${visibility === 'public' ? 'text-gray-900' : 'text-gray-400'}`}>Public</span>
                    <button
                      type="button"
                      onClick={() => setVisibility(v => v === 'public' ? 'internal' : 'public')}
                      className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 transition-colors cursor-pointer shrink-0"
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${visibility === 'internal' ? 'translate-x-4 bg-blue-500' : 'translate-x-1'}`} />
                    </button>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${visibility === 'internal' ? 'text-gray-900' : 'text-gray-400'}`}>Internal</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-white border border-gray-200 rounded-2xl p-4 pr-14 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px] shadow-sm mb-3"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="absolute bottom-6 right-3 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm transition"
                >
                  <PaperAirplaneIcon className="w-5 h-5 shrink-0" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-sm flex justify-center items-center gap-2 transition md:hidden"
              >
                <PaperAirplaneIcon className="w-4 h-4 shrink-0" />
                Post Comment
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TicketDetails;
