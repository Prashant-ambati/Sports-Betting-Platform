import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Event } from '../../../shared/types';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=6&status=upcoming');
        const data = await response.json();
        
        if (data.success) {
          setFeaturedEvents(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to SportsBet
          </h1>
          <p className="text-xl mb-8">
            The ultimate platform for sports betting with real-time odds and secure transactions
          </p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/events"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/events"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Place Bets
              </Link>
              <Link
                to="/profile"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${user?.balance?.toFixed(2)}
              </div>
              <div className="text-gray-600">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                0
              </div>
              <div className="text-gray-600">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                0%
              </div>
              <div className="text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <Link
            to="/events"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500 uppercase">
                    {event.sport}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'live' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time Odds</h3>
          <p className="text-gray-600">Get live odds updates as events progress</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
          <p className="text-gray-600">Your funds and data are protected with bank-level security</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Instant Payouts</h3>
          <p className="text-gray-600">Receive your winnings immediately after event completion</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 