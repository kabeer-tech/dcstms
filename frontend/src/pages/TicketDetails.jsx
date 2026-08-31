import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statusMap = {
  submitted: { label: 'Submitted', class: 'badge-submitted' },
  in_review: { label: 'In Review', class: 'badge-in_review' },
  escalated: { label: 'Escalated', class: 'badge-escalated' },
  resolved: { label: 'Resolved', class: 'badge-resolved' },
  closed: { label: 'Closed', class: 'badge-closed' },
};

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data.data);
      } catch (err) {
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, navigate]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comments/${id}`, { 
        message: comment, 
        visibility: user?.role === 'student' ? 'public' : 'internal'
      });
      setComment('');
      await fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-600">Loading...</div>;
  if (!ticket) return <div className="p-6 text-center text-gray-500">Ticket not found</div>;

  const statusInfo = statusMap[ticket.status] || { label: ticket.status, class: 'badge' };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-2">
        ← Back
      </button>

      <div className="card space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.ticketNumber}</h1>
            <p className="text-sm text-gray-500">{ticket.ticketType.toUpperCase()}</p>
          </div>
          <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="font-medium text-gray-600">Priority:</span> {ticket.priority}</p>
          <p><span className="font-medium text-gray-600">Department:</span> {ticket.department?.name || 'N/A'}</p>
          <p><span className="font-medium text-gray-600">Created:</span> {new Date(ticket.createdAt).toLocaleString()}</p>
          {ticket.resolvedAt && <p><span className="font-medium text-gray-600">Resolved:</span> {new Date(ticket.resolvedAt).toLocaleString()}</p>}
        </div>

        <div className="border-t pt-3">
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6 card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💬 Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((c) => (
              <div key={c._id} className="border-l-4 border-blue-400 pl-4 py-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-800">{c.author?.name || 'Unknown'}</span>
                  <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 mt-1">{c.message}</p>
                {c.visibility === 'internal' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full mt-1 inline-block">🔒 Internal</span>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="input-field"
            rows="3"
          />
          <button type="submit" disabled={submitting} className="btn-primary mt-2">
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
