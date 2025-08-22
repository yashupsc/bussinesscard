import React, { useState } from 'react';
import { useBusinessCards } from '../hooks/useBusinessCards';
import { useAuth } from '../hooks/useAuth';
import { BusinessCardForm } from './BusinessCardForm';
import { BusinessCardList } from './BusinessCardList';
import { Plus, LogOut, CreditCard } from 'lucide-react';

export function BusinessCardManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { businessCards, loading } = useBusinessCards();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditCard = (cardId: string) => {
    setEditingCard(cardId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCard(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your business cards...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <BusinessCardForm 
        cardId={editingCard}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Business Cards</h1>
                <p className="text-gray-600">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                New Card
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {businessCards.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Business Cards Yet</h2>
            <p className="text-gray-600 mb-6">Create your first digital business card to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Your First Card
            </button>
          </div>
        ) : (
          <BusinessCardList 
            businessCards={businessCards}
            onEditCard={handleEditCard}
          />
        )}
      </div>
    </div>
  );
}