-- Create Enum for property types
CREATE TYPE property_type AS ENUM ('Shared Room', 'Private Room', 'PG', 'Hostel', 'Apartment');

-- Create Enum for gender preferences
CREATE TYPE gender_preference AS ENUM ('Male', 'Female', 'Any');

-- Create the rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  property_type property_type NOT NULL,
  gender_preference gender_preference NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT NOT NULL,
  available BOOLEAN DEFAULT true NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create room_images table
CREATE TABLE room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  username TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  verified BOOLEAN DEFAULT true NOT NULL,
  helpful INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(room_id, user_id)
);

-- Function to increment room views
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

-- Setup Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public read access to rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access to room_images" ON room_images FOR SELECT USING (true);
CREATE POLICY "Public read access to reviews" ON reviews FOR SELECT USING (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Admin full access to rooms" ON rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to room_images" ON room_images FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public) VALUES ('room_images', 'room_images', true);

-- Storage bucket policies
CREATE POLICY "Public read access to room_images bucket" ON storage.objects FOR SELECT USING (bucket_id = 'room_images');
CREATE POLICY "Admin full access to room_images bucket" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'room_images');
