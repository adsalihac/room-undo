-- Migration: Add new columns and functions for v2 features
-- Run this in your Supabase SQL editor

-- Add new columns to rooms table
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0 NOT NULL;

-- Create function to increment room views
CREATE OR REPLACE FUNCTION increment_room_views(room_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE rooms
  SET views = views + 1
  WHERE id = room_id;
END;
$$;

-- Review table additions (for new frontend features)
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS helpful INTEGER DEFAULT 0 NOT NULL;

-- Drop separate amenities table (data migrated to rooms.amenities JSONB)
-- Uncomment after you've migrated existing data:
-- INSERT INTO rooms (amenities) 
--   SELECT jsonb_agg(name) FROM amenities WHERE amenities.room_id = rooms.id GROUP BY room_id;
-- DROP TABLE IF EXISTS amenities;
