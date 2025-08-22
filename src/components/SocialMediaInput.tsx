import React, { useState, useEffect } from 'react';
import { generateSocialMediaUrl, getSupportedPlatforms, SocialMediaResult } from '../utils/socialMediaUrlGenerator';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';

interface SocialMediaInputProps {
  socialAccounts: Array<{id: string, platform: string, username: string}>;
  onSocialAccountsChange: (accounts: Array<{id: string, platform: string, username: string}>) => void;
  onGeneratedUrlsChange: (urls: SocialMediaResult[]) => void;
}

export function SocialMediaInput({ socialAccounts, onSocialAccountsChange, onGeneratedUrlsChange }: SocialMediaInputProps) {
  const [generatedUrls, setGeneratedUrls] = useState<SocialMediaResult[]>([]);
  const supportedPlatforms = getSupportedPlatforms();

  // Generate URLs whenever social accounts change
  useEffect(() => {
    const urls = socialAccounts
      .filter(account => account.platform && account.username)
      .map(account => generateSocialMediaUrl(account.platform, account.username));
    
    setGeneratedUrls(urls);
    onGeneratedUrlsChange(urls);
  }, [socialAccounts, onGeneratedUrlsChange]);

  const addSocialAccount = () => {
    const newAccount = {
      id: Date.now().toString(),
      platform: '',
      username: ''
    };
    onSocialAccountsChange([...socialAccounts, newAccount]);
  };

  const removeSocialAccount = (id: string) => {
    onSocialAccountsChange(socialAccounts.filter(account => account.id !== id));
  };

  const updateSocialAccount = (id: string, field: 'platform' | 'username', value: string) => {
    onSocialAccountsChange(
      socialAccounts.map(account => 
        account.id === id ? { ...account, [field]: value } : account
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Profiles</h3>
        <button
          type="button"
          onClick={addSocialAccount}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Platform
        </button>
      </div>

      <div className="space-y-4">
        {socialAccounts.map((account) => {
          const generatedUrl = generatedUrls.find(url => 
            url.platform === account.platform && url.username === account.username
          );

          return (
            <div key={account.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={account.platform}
                    onChange={(e) => updateSocialAccount(account.id, 'platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select platform</option>
                    {supportedPlatforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={account.username}
                      onChange={(e) => updateSocialAccount(account.id, 'username', e.target.value)}
                      placeholder="Enter username (without @)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialAccount(account.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {generatedUrl && generatedUrl.isValid && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Generated URL:</p>
                      <a
                        href={generatedUrl.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:text-green-900 underline text-sm break-all"
                      >
                        {generatedUrl.profileUrl}
                      </a>
                    </div>
                    <ExternalLink size={16} className="text-green-600 flex-shrink-0" />
                  </div>
                </div>
              )}

              {generatedUrl && !generatedUrl.isValid && account.username && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Platform not supported or invalid username. Using raw text: {account.username}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {socialAccounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No social media accounts added yet.</p>
            <p className="text-sm">Click "Add Platform" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}