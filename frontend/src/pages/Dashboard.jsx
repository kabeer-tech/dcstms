import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome, {user?.name}!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/tickets/new" className="bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 text-center">
          Submit New Ticket
        </Link>
        <Link to="/tickets" className="bg-gray-200 p-4 rounded-lg shadow hover:bg-gray-300 text-center">
          View My Tickets
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
