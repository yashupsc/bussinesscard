/**
 * Universal Social Media URL Generator
 * Converts platform names and usernames to full profile URLs
 */

export interface SocialMediaResult {
  platform: string;
  username: string;
  profileUrl: string;
  isValid: boolean;
}

// Platform URL patterns - easily extensible
const PLATFORM_PATTERNS: Record<string, string> = {
  // Major Social Media
  instagram: 'https://instagram.com/',
  twitter: 'https://twitter.com/',
  x: 'https://x.com/',
  facebook: 'https://facebook.com/',
  linkedin: 'https://linkedin.com/in/',
  youtube: 'https://youtube.com/@',
  tiktok: 'https://tiktok.com/@',
  snapchat: 'https://snapchat.com/add/',
  
  // Professional Networks
  github: 'https://github.com/',
  behance: 'https://behance.net/',
  dribbble: 'https://dribbble.com/',
  medium: 'https://medium.com/@',
  
  // Communication
  discord: 'https://discord.com/users/',
  telegram: 'https://t.me/',
  whatsapp: 'https://wa.me/',
  skype: 'skype:',
  
  // Entertainment & Streaming
  twitch: 'https://twitch.tv/',
  spotify: 'https://open.spotify.com/user/',
  reddit: 'https://reddit.com/u/',
  pinterest: 'https://pinterest.com/',
  
  // Other Platforms
  tumblr: 'https://tumblr.com/blog/',
  flickr: 'https://flickr.com/people/',
  vimeo: 'https://vimeo.com/',
  soundcloud: 'https://soundcloud.com/',
  clubhouse: 'https://clubhouse.com/@',
};

/**
 * Validates username - checks if it's not empty and contains valid characters
 */
function validateUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  const trimmed = username.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/**
 * Normalizes platform name to match our patterns
 */
function normalizePlatform(platform: string): string {
  if (!platform || typeof platform !== 'string') return '';
  return platform.toLowerCase().trim().replace(/\s+/g, '');
}

/**
 * Cleans username by removing @ symbols and whitespace
 */
function cleanUsername(username: string): string {
  return username.trim().replace(/^@+/, '');
}

/**
 * Universal function to generate social media profile URLs
 * @param platform - The social media platform name
 * @param username - The username (with or without @)
 * @returns Structured result with platform, username, and profile URL
 */
export function generateSocialMediaUrl(platform: string, username: string): SocialMediaResult {
  const normalizedPlatform = normalizePlatform(platform);
  const cleanedUsername = cleanUsername(username);
  
  // Validate inputs
  if (!validateUsername(cleanedUsername)) {
    return {
      platform,
      username,
      profileUrl: username, // Return raw text for invalid usernames
      isValid: false
    };
  }
  
  // Check if platform is supported
  const urlPattern = PLATFORM_PATTERNS[normalizedPlatform];
  
  if (!urlPattern) {
    // Unknown platform - return username as raw text
    return {
      platform,
      username: cleanedUsername,
      profileUrl: cleanedUsername,
      isValid: false
    };
  }
  
  // Generate the full profile URL
  const profileUrl = urlPattern + cleanedUsername;
  
  return {
    platform,
    username: cleanedUsername,
    profileUrl,
    isValid: true
  };
}

/**
 * Batch process multiple social media accounts
 */
export function generateMultipleSocialUrls(socialAccounts: Array<{platform: string, username: string}>): SocialMediaResult[] {
  return socialAccounts
    .filter(account => account.platform && account.username)
    .map(account => generateSocialMediaUrl(account.platform, account.username));
}

/**
 * Get list of supported platforms
 */
export function getSupportedPlatforms(): string[] {
  return Object.keys(PLATFORM_PATTERNS).sort();
}

/**
 * Check if a platform is supported
 */
export function isPlatformSupported(platform: string): boolean {
  const normalized = normalizePlatform(platform);
  return normalized in PLATFORM_PATTERNS;
}