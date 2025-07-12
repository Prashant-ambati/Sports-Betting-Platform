import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '../../../shared/types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
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

  if (!event) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mt-2">{event.description}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${
            event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
            event.status === 'live' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Sport:</span>
                <span className="ml-2 font-medium capitalize">{event.sport}</span>
              </div>
              <div>
                <span className="text-gray-600">Start Time:</span>
                <span className="ml-2 font-medium">
                  {new Date(event.startTime).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">End Time:</span>
                <span className="ml-2 font-medium">
                  {new Date(event.endTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {event.odds && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Odds</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Home</div>
                  <div className="text-2xl font-bold text-blue-600">{event.odds.home}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Away</div>
                  <div className="text-2xl font-bold text-blue-600">{event.odds.away}</div>
                </div>
                {event.odds.draw && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Draw</div>
                    <div className="text-2xl font-bold text-blue-600">{event.odds.draw}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {event.result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Result</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Home Score</div>
                  <div className="text-xl font-bold">{event.result.homeScore}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Away Score</div>
                  <div className="text-xl font-bold">{event.result.awayScore}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Winner</div>
                  <div className="text-xl font-bold capitalize">{event.result.winner}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail; 