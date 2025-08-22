import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { generateSocialMediaUrl } from '../utils/socialMediaUrlGenerator';

type BusinessCard = Database['public']['Tables']['business_cards']['Row'];
type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];
type BusinessCardInsert = Database['public']['Tables']['business_cards']['Insert'];
type SocialAccountInsert = Database['public']['Tables']['social_accounts']['Insert'];

export interface BusinessCardWithSocials extends BusinessCard {
  social_accounts: SocialAccount[];
}

export function useBusinessCards() {
  const [businessCards, setBusinessCards] = useState<BusinessCardWithSocials[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all business cards for the current user
  const fetchBusinessCards = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBusinessCards([]);
        return;
      }

      const { data: cards, error: cardsError } = await supabase
        .from('business_cards')
        .select(`
          *,
          social_accounts (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (cardsError) throw cardsError;

      setBusinessCards(cards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business cards');
    } finally {
      setLoading(false);
    }
  };

  // Create a new business card
  const createBusinessCard = async (cardData: Omit<BusinessCardInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: card, error: cardError } = await supabase
        .from('business_cards')
        .insert({
          ...cardData,
          user_id: user.id
        })
        .select()
        .single();

      if (cardError) throw cardError;

      await fetchBusinessCards();
      return card;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business card');
      throw err;
    }
  };

  // Update an existing business card
  const updateBusinessCard = async (id: string, updates: Partial<BusinessCardInsert>) => {
    try {
      const { error } = await supabase
        .from('business_cards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchBusinessCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business card');
      throw err;
    }
  };

  // Delete a business card
  const deleteBusinessCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBusinessCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business card');
      throw err;
    }
  };

  // Add social account to a business card
  const addSocialAccount = async (businessCardId: string, platform: string, username: string) => {
    try {
      const socialResult = generateSocialMediaUrl(platform, username);
      
      const socialData: SocialAccountInsert = {
        business_card_id: businessCardId,
        platform: socialResult.platform,
        username: socialResult.username,
        profile_url: socialResult.profileUrl,
        is_valid: socialResult.isValid,
        display_order: 0
      };

      const { error } = await supabase
        .from('social_accounts')
        .insert(socialData);

      if (error) throw error;

      await fetchBusinessCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add social account');
      throw err;
    }
  };

  // Update social account
  const updateSocialAccount = async (id: string, platform: string, username: string) => {
    try {
      const socialResult = generateSocialMediaUrl(platform, username);
      
      const { error } = await supabase
        .from('social_accounts')
        .update({
          platform: socialResult.platform,
          username: socialResult.username,
          profile_url: socialResult.profileUrl,
          is_valid: socialResult.isValid
        })
        .eq('id', id);

      if (error) throw error;

      await fetchBusinessCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update social account');
      throw err;
    }
  };

  // Delete social account
  const deleteSocialAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBusinessCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete social account');
      throw err;
    }
  };

  // Get public business card (for sharing)
  const getPublicBusinessCard = async (id: string): Promise<BusinessCardWithSocials | null> => {
    try {
      const { data: card, error } = await supabase
        .from('business_cards')
        .select(`
          *,
          social_accounts (*)
        `)
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return card;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public business card');
      return null;
    }
  };

  useEffect(() => {
    fetchBusinessCards();
  }, []);

  return {
    businessCards,
    loading,
    error,
    createBusinessCard,
    updateBusinessCard,
    deleteBusinessCard,
    addSocialAccount,
    updateSocialAccount,
    deleteSocialAccount,
    getPublicBusinessCard,
    refetch: fetchBusinessCards
  };
}