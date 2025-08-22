import React from 'react';
import { BusinessCardWithSocials, useBusinessCards } from '../hooks/useBusinessCards';
import { Edit, Trash2, Share, Eye, ExternalLink } from 'lucide-react';

interface BusinessCardListProps {
  businessCards: BusinessCardWithSocials[];
  onEditCard: (cardId: string) => void;
}

export function BusinessCardList({ businessCards, onEditCard }: BusinessCardListProps) {
  const { deleteBusinessCard, updateBusinessCard } = useBusinessCards();

  const handleDelete = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this business card?')) {
      await deleteBusinessCard(cardId);
    }
  };

  const togglePublic = async (card: BusinessCardWithSocials) => {
    await updateBusinessCard(card.id, { is_public: !card.is_public });
  };

  const copyShareLink = (cardId: string) => {
    const shareUrl = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businessCards.map((card) => (
        <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <h3 className="text-xl font-bold truncate">
              {card.first_name} {card.last_name}
            </h3>
            {card.job_title && (
              <p className="text-blue-100 text-sm truncate">{card.job_title}</p>
            )}
            {card.company && (
              <p className="text-blue-100 text-xs truncate">{card.company}</p>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="space-y-3">
              {card.email && (
                <p className="text-sm text-gray-600 truncate">📧 {card.email}</p>
              )}
              {card.phone && (
                <p className="text-sm text-gray-600">📞 {card.phone}</p>
              )}
              {card.social_accounts.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Social Media ({card.social_accounts.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {card.social_accounts.slice(0, 3).map((social) => (
                      <span
                        key={social.id}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
                      >
                        {social.platform}
                      </span>
                    ))}
                    {card.social_accounts.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{card.social_accounts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Public Status */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  card.is_public 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {card.is_public ? '🌐 Public' : '🔒 Private'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(card.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditCard(card.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => togglePublic(card)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title={card.is_public ? 'Make Private' : 'Make Public'}
                >
                  {card.is_public ? <Eye size={16} /> : <Share size={16} />}
                </button>
                {card.is_public && (
                  <button
                    onClick={() => copyShareLink(card.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Copy Share Link"
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleDelete(card.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}