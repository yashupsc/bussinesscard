import React from 'react';
import { PersonalInfo, Address } from '../types/businessCard';
import { SocialMediaResult } from '../utils/socialMediaUrlGenerator';
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';

interface BusinessCardPreviewProps {
  personalInfo: PersonalInfo;
  address: Address;
  generatedUrls: SocialMediaResult[];
}

export function BusinessCardPreview({ personalInfo, address, generatedUrls }: BusinessCardPreviewProps) {
  const hasPersonalInfo = personalInfo.firstName || personalInfo.lastName || personalInfo.jobTitle;
  const hasContactInfo = personalInfo.email || personalInfo.phone || personalInfo.website;
  const hasAddress = address.street || address.city || address.state;
  const hasSocialMedia = generatedUrls.length > 0;

  if (!hasPersonalInfo && !hasContactInfo && !hasAddress && !hasSocialMedia) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
        <p>Fill out the form to see your business card preview</p>
      </div>
    );
  }

  const fullAddress = [address.street, address.city, address.state, address.zipCode, address.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h2>
        {personalInfo.jobTitle && (
          <p className="text-blue-100 mt-1">{personalInfo.jobTitle}</p>
        )}
        {personalInfo.company && (
          <p className="text-blue-100 text-sm mt-1">{personalInfo.company}</p>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* Bio */}
        {personalInfo.bio && (
          <div>
            <p className="text-gray-700 leading-relaxed">{personalInfo.bio}</p>
          </div>
        )}

        {/* Contact Information */}
        {hasContactInfo && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-2">
              {personalInfo.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={16} className="text-blue-600" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={16} className="text-blue-600" />
                  <a href={`tel:${personalInfo.phone}`} className="hover:text-blue-600 transition-colors">
                    {personalInfo.phone}
                  </a>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe size={16} className="text-blue-600" />
                  <a 
                    href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {personalInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address */}
        {hasAddress && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin size={16} className="text-blue-600 mt-0.5" />
              <p>{fullAddress}</p>
            </div>
          </div>
        )}

        {/* Social Media */}
        {hasSocialMedia && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {generatedUrls.map((social, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {social.platform}
                    </p>
                    <p className="text-sm text-gray-600">@{social.username}</p>
                  </div>
                  {social.isValid && (
                    <a
                      href={social.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Output */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Generated JSON Output</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
            <pre>
              {JSON.stringify({
                personalInfo,
                address: hasAddress ? address : undefined,
                socialMedia: generatedUrls
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}