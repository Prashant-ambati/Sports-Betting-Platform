import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../../shared/types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sport: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sports Events</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sport
            </label>
            <select
              value={filters.sport}
              onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sports</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="baseball">Baseball</option>
              <option value="hockey">Hockey</option>
              <option value="soccer">Soccer</option>
              <option value="cricket">Cricket</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
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
              
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-500">
                  Start: {new Date(event.startTime).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  End: {new Date(event.endTime).toLocaleString()}
                </div>
              </div>

              {event.odds && (
                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Current Odds</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Home</div>
                      <div className="text-blue-600">{event.odds.home}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Away</div>
                      <div className="text-blue-600">{event.odds.away}</div>
                    </div>
                    {event.odds.draw && (
                      <div className="text-center">
                        <div className="font-medium">Draw</div>
                        <div className="text-blue-600">{event.odds.draw}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Link
                to={`/events/${event.id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Events; 