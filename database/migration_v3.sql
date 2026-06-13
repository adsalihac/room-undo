-- Migration: Add user_id to reviews and enforce one review per user per room
-- Run this in your Supabase SQL editor

-- Add user_id column
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add unique constraint to prevent duplicate reviews
ALTER TABLE reviews
  ADD CONSTRAINT unique_room_user_review UNIQUE (room_id, user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_room_user ON reviews(room_id, user_id);

-- Update RLS: only authenticated users can insert reviews
DROP POLICY IF EXISTS "Public insert access to reviews" ON reviews;
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
