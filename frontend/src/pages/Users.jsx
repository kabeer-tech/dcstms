import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  TrashIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      // Assumes you have a GET /api/users route for admins
      const res = await api.get('/users'); 
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    if (role === 'admin') return <ShieldCheckIcon className="w-4 h-4 text-purple-600" />;
    if (role === 'staff') return <BriefcaseIcon className="w-4 h-4 text-blue-600" />;
    return <AcademicCapIcon className="w-4 h-4 text-green-600" />;
  };

  if (user?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied: Admins Only</div>;
  }

  return (
    <div className="max-w-6xl pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage campus accounts, assign roles, and control access.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 w-max">
          <UserGroupIcon className="w-4 h-4" />
          {users.length} Total Users
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-medium transition"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'admin', 'staff', 'student'].map((role) => (
             <button 
               key={role}
               onClick={() => setRoleFilter(role)}
               className={`capitalize flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition shadow-sm ${
                 roleFilter === role 
                   ? 'bg-gray-900 text-white border-gray-900' 
                   : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
               }`}
             >
               {role}
             </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100">
          <p className="text-gray-500 font-bold text-lg">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Department / ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
                          {u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs font-medium text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        u.role === 'staff' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {getRoleIcon(u.role)} {u.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{u.department?.name || '—'}</p>
                      <p className="text-xs font-medium text-gray-500">{u.matricNoOrStaffId || 'No ID'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === user._id}
                          className="bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg focus:ring-2 focus:ring-blue-500 outline-none px-2 py-1.5 shadow-sm disabled:opacity-50"
                        >
                          <option value="student">Student</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u._id === user._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete User"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;