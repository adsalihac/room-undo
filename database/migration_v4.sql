-- Migration: Add owner_reply to reviews
-- Run this in your Supabase SQL editor

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS owner_reply TEXT DEFAULT '';
