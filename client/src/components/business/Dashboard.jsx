import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBook, FaUsers, FaGavel, FaFileAlt } from 'react-icons/fa';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'business') {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/book-records/summary');
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const businessLinks = [
    { to: '/business-profile', icon: FaBuilding, label: 'Business Profile', color: 'blue' },
    { to: '/book-records', icon: FaBook, label: 'Book Records', color: 'green' },
    { to: '/gst-guides', icon: FaFileAlt, label: 'GST Guides', color: 'purple' },
    { to: '/mentors', icon: FaUsers, label: 'Find Mentors', color: 'orange' },
    { to: '/lawyers', icon: FaGavel, label: 'Legal Support', color: 'red' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          {user?.role === 'business' && 'Manage your business and connect with experts'}
          {user?.role === 'mentor' && 'Help businesses grow and succeed'}
          {user?.role === 'lawyer' && 'Provide legal guidance to businesses'}
        </p>
      </div>

      {user?.role === 'business' && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-green-800 font-semibold mb-2">Total Income</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹{summary.totalIncome.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-red-800 font-semibold mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              ₹{summary.totalExpense.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-blue-800 font-semibold mb-2">Net Profit</h3>
            <p className="text-3xl font-bold text-blue-600">
              ₹{summary.profit.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(user?.role === 'business' ? businessLinks : [
            { to: '/gst-guides', icon: FaFileAlt, label: 'Share Knowledge', color: 'purple' },
            { to: '/mentors', icon: FaUsers, label: 'View Network', color: 'orange' },
          ]).map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                to={link.to}
                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-${link.color}-500`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`bg-${link.color}-100 p-3 rounded-lg`}>
                    <Icon className={`text-2xl text-${link.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{link.label}</h3>
                    <p className="text-gray-600 text-sm">Access now →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {user?.role !== 'business' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Role:</span> {user?.role}</p>
            {user?.expertise && (
              <p><span className="font-semibold">Expertise:</span> {user.expertise.join(', ')}</p>
            )}
            {user?.bio && (
              <p><span className="font-semibold">Bio:</span> {user.bio}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;