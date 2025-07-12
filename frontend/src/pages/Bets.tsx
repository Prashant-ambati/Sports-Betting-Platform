import React, { useState, useEffect } from 'react';
import { Bet } from '../../../shared/types';

const Bets: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await fetch('/api/bets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setBets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-bold text-gray-900">My Bets</h1>

      {bets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't placed any bets yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div key={bet.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Event #{bet.eventId}</h3>
                  <p className="text-sm text-gray-600">
                    Bet: {bet.prediction} @ {bet.odds}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bet.status)}`}>
                  {bet.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-semibold">${bet.amount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Potential Winnings</div>
                  <div className="font-semibold text-green-600">
                    ${bet.potentialWinnings.toFixed(2)}
                  </div>
                </div>
                {bet.actualWinnings && (
                  <div>
                    <div className="text-sm text-gray-600">Actual Winnings</div>
                    <div className="font-semibold text-blue-600">
                      ${bet.actualWinnings.toFixed(2)}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Placed</div>
                  <div className="font-semibold">
                    {new Date(bet.placedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bets; 