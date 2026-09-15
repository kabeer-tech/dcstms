import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { ChartPieIcon, ClockIcon, DocumentChartBarIcon, TicketIcon } from '@heroicons/react/24/outline';

const STATUS_COLORS = { submitted: '#3b82f6', in_review: '#eab308', escalated: '#f97316', resolved: '#10b981', closed: '#6b7280' };
const PRIORITY_COLORS = { low: '#9ca3af', medium: '#eab308', high: '#f97316', urgent: '#ef4444' };
const TYPE_COLORS = { complaint: '#ef4444', service_request: '#3b82f6' };

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setData(res.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading metrics...</div>;
  if (!data) return <div className="text-center py-20 font-medium text-red-500">Failed to load data.</div>;

  // Format Monthly Trend Data
  const formatMonthData = (trendData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = {};
    trendData.forEach(item => {
      const monthName = `${months[item._id.month - 1]}`;
      if (!formatted[monthName]) formatted[monthName] = { name: monthName, complaint: 0, service_request: 0 };
      formatted[monthName][item._id.type] = item.count;
    });
    return Object.values(formatted);
  };

  const monthlyData = formatMonthData(data.monthlyTrend);
  const avgResolutionHours = data.avgResolution.length > 0 
    ? (data.avgResolution.reduce((acc, curr) => acc + curr.avgHours, 0) / data.avgResolution.length).toFixed(1)
    : 0;

  return (
    <div className="pb-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">System Analytics</h1>
        <p className="text-gray-500 text-sm font-medium">Overview of system performance and ticket volume.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gray-900">{data.total}</p>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Total Tickets</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
            <DocumentChartBarIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gray-900">{avgResolutionHours} <span className="text-lg">hrs</span></p>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Avg Resolution Time</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
            <ClockIcon className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gray-900">
              {data.byStatus.find(s => s._id === 'submitted')?.count || 0}
            </p>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Open & Unassigned</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
            <TicketIcon className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 6-Month Trend */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ChartPieIcon className="w-5 h-5 text-blue-500" /> 6-Month Volume Trend
          </h3>
          <div className="h-64 w-full text-xs font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" name="Complaints" dataKey="complaint" stroke={TYPE_COLORS.complaint} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Service Requests" dataKey="service_request" stroke={TYPE_COLORS.service_request} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown by Type (Bar) */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DocumentChartBarIcon className="w-5 h-5 text-blue-500" /> Volume by Type
          </h3>
          <div className="h-64 w-full text-xs font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byType} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', textTransform: 'capitalize' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry._id] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown (Pie) */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ChartPieIcon className="w-5 h-5 text-blue-500" /> Priority Distribution
          </h3>
          <div className="h-64 w-full text-xs font-bold flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.byPriority} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {data.byPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry._id] || '#9ca3af'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown (Pie) */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ChartPieIcon className="w-5 h-5 text-blue-500" /> Status Distribution
          </h3>
          <div className="h-64 w-full text-xs font-bold flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.byStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {data.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || '#9ca3af'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
