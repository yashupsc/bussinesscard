import React, { useState, useEffect } from 'react';
import { useBusinessCards, BusinessCardWithSocials } from '../hooks/useBusinessCards';
import { SocialMediaInput } from './SocialMediaInput';
import { BusinessCardPreview } from './BusinessCardPreview';
import { PersonalInfo, Address, SocialAccount } from '../types/businessCard';
import { SocialMediaResult } from '../utils/socialMediaUrlGenerator';
import { ArrowLeft, Save, User, MapPin } from 'lucide-react';

interface BusinessCardFormProps {
  cardId?: string | null;
  onClose: () => void;
}

export function BusinessCardForm({ cardId, onClose }: BusinessCardFormProps) {
  const { businessCards, createBusinessCard, updateBusinessCard, addSocialAccount, updateSocialAccount, deleteSocialAccount } = useBusinessCards();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    bio: ''
  });

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [generatedUrls, setGeneratedUrls] = useState<SocialMediaResult[]>([]);

  // Load existing card data if editing
  useEffect(() => {
    if (cardId) {
      const existingCard = businessCards.find(card => card.id === cardId);
      if (existingCard) {
        setPersonalInfo({
          firstName: existingCard.first_name,
          lastName: existingCard.last_name,
          jobTitle: existingCard.job_title,
          company: existingCard.company,
          email: existingCard.email,
          phone: existingCard.phone,
          website: existingCard.website,
          bio: existingCard.bio
        });

        setAddress({
          street: existingCard.street,
          city: existingCard.city,
          state: existingCard.state,
          zipCode: existingCard.zip_code,
          country: existingCard.country
        });

        setSocialAccounts(existingCard.social_accounts.map(social => ({
          id: social.id,
          platform: social.platform,
          username: social.username
        })));
      }
    }
  }, [cardId, businessCards]);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const cardData = {
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        job_title: personalInfo.jobTitle,
        company: personalInfo.company,
        email: personalInfo.email,
        phone: personalInfo.phone,
        website: personalInfo.website,
        bio: personalInfo.bio,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        country: address.country
      };

      if (cardId) {
        // Update existing card
        await updateBusinessCard(cardId, cardData);
        
        // Handle social accounts updates
        const existingCard = businessCards.find(card => card.id === cardId);
        if (existingCard) {
          const existingSocials = existingCard.social_accounts;
          
          // Delete removed social accounts
          for (const existing of existingSocials) {
            if (!socialAccounts.find(social => social.id === existing.id)) {
              await deleteSocialAccount(existing.id);
            }
          }
          
          // Update or add social accounts
          for (const social of socialAccounts) {
            if (social.id && existingSocials.find(existing => existing.id === social.id)) {
              // Update existing
              await updateSocialAccount(social.id, social.platform, social.username);
            } else if (!social.id) {
              // Add new
              await addSocialAccount(cardId, social.platform, social.username);
            }
          }
        }
      } else {
        // Create new card
        const newCard = await createBusinessCard(cardData);
        
        // Add social accounts
        for (const social of socialAccounts) {
          if (social.platform && social.username) {
            await addSocialAccount(newCard.id, social.platform, social.username);
          }
        }
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save business card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {cardId ? 'Edit Business Card' : 'Create Business Card'}
                </h1>
                <p className="text-gray-600">Fill out your information to create a professional digital business card</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Saving...' : 'Save Card'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="John"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={personalInfo.jobTitle}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={personalInfo.company}
                    onChange={(e) => updatePersonalInfo('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tech Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://johndoe.com"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={personalInfo.bio}
                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Brief description about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="New York"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="NY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="10001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => updateAddress('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <SocialMediaInput
                socialAccounts={socialAccounts}
                onSocialAccountsChange={setSocialAccounts}
                onGeneratedUrlsChange={setGeneratedUrls}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
              <p className="text-gray-600 text-sm">See how your business card will look</p>
            </div>
            <BusinessCardPreview
              personalInfo={personalInfo}
              address={address}
              generatedUrls={generatedUrls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}