import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Username:</span>
              <span className="ml-2 font-medium">{user?.username}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user?.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Role:</span>
              <span className="ml-2 font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Betting Statistics</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${user?.balance?.toFixed(2)}
              </div>
              <div className="text-gray-600">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {profile?.totalBets || 0}
              </div>
              <div className="text-gray-600">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ${profile?.totalWinnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-gray-600">Total Winnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {profile?.winRate?.toFixed(1) || '0'}%
              </div>
              <div className="text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 