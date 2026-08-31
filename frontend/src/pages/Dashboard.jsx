import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-600 mt-1">Here's your quick access panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/tickets/new"
          className="card hover:scale-[1.02] transition-transform cursor-pointer border-2 border-blue-100 hover:border-blue-400"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Submit New Ticket</h2>
              <p className="text-gray-600 text-sm">File a complaint or service request</p>
            </div>
          </div>
        </Link>

        <Link
          to="/tickets"
          className="card hover:scale-[1.02] transition-transform cursor-pointer border-2 border-green-100 hover:border-green-400"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-full">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">View My Tickets</h2>
              <p className="text-gray-600 text-sm">Track your existing requests</p>
            </div>
          </div>
        </Link>
      </div>

      {user?.role === 'admin' && (
        <div className="mt-8">
          <Link
            to="/admin"
            className="card border-2 border-purple-100 hover:border-purple-400 inline-block"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <span className="text-3xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Admin Panel</h2>
                <p className="text-gray-600 text-sm">Manage users and system settings</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
