/*
  # Business Card Builder Database Schema

  1. New Tables
    - `business_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text) - Custom name for the business card
      - `first_name` (text)
      - `last_name` (text)
      - `job_title` (text)
      - `company` (text)
      - `email` (text)
      - `phone` (text)
      - `website` (text)
      - `bio` (text)
      - `street` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `country` (text)
      - `is_public` (boolean) - Whether the card can be shared publicly
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `social_accounts`
      - `id` (uuid, primary key)
      - `business_card_id` (uuid, references business_cards)
      - `platform` (text)
      - `username` (text)
      - `profile_url` (text) - Generated URL
      - `is_valid` (boolean) - Whether the URL was successfully generated
      - `display_order` (integer) - Order for displaying social accounts
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own business cards
    - Public cards can be viewed by anyone when accessed via share link
    - Social accounts inherit permissions from parent business card

  3. Indexes
    - Index on user_id for fast user queries
    - Index on business_card_id for social accounts
    - Index on is_public for public card discovery
*/

-- Create business_cards table
CREATE TABLE IF NOT EXISTS business_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'My Business Card',
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  job_title text DEFAULT '',
  company text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  website text DEFAULT '',
  bio text DEFAULT '',
  street text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  zip_code text DEFAULT '',
  country text DEFAULT '',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_card_id uuid REFERENCES business_cards(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  profile_url text NOT NULL,
  is_valid boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_business_cards_public ON business_cards(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_social_accounts_business_card_id ON social_accounts(business_card_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_display_order ON social_accounts(business_card_id, display_order);

-- RLS Policies for business_cards
CREATE POLICY "Users can view own business cards"
  ON business_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business cards"
  ON business_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business cards"
  ON business_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business cards"
  ON business_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public business cards"
  ON business_cards
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- RLS Policies for social_accounts
CREATE POLICY "Users can view social accounts of own business cards"
  ON social_accounts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert social accounts for own business cards"
  ON social_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update social accounts of own business cards"
  ON social_accounts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete social accounts of own business cards"
  ON social_accounts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view social accounts of public business cards"
  ON social_accounts
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_cards 
      WHERE business_cards.id = social_accounts.business_card_id 
      AND business_cards.is_public = true
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on business_cards
CREATE TRIGGER update_business_cards_updated_at
  BEFORE UPDATE ON business_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();