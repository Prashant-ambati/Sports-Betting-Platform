import React, { useState, useEffect } from 'react';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalUsers}
              </div>
              <div className="text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalEvents}
              </div>
              <div className="text-gray-600">Total Events</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalBets}
              </div>
              <div className="text-gray-600">Total Bets</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                ${stats.totalVolume?.toFixed(2) || '0.00'}
              </div>
              <div className="text-gray-600">Total Volume</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="font-medium">Bet Placed</span>
                  <span className="text-gray-600 ml-2">by User #{activity.userId}</span>
                </div>
                <div className="text-sm text-gray-500">
                  ${activity.amount.toFixed(2)} - {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default Admin; 