/*
  # Create Items Table

  1. New Tables
    - `items`
      - `id` (bigserial, primary key) - Unique identifier for each item
      - `title` (text) - Title of the item
      - `description` (text) - Description of the item
      - `test_options` (text[]) - Array of 4 multiple-choice options for the test
      - `image` (text) - URL/path to the item's image
      - `created_at` (timestamptz) - Timestamp when the item was created
      - `updated_at` (timestamptz) - Timestamp when the item was last updated

  2. Security
    - Enable RLS on `items` table
    - Add policy for anyone to read items (public access)
    - Add policy for anyone to insert items (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS items (
  id bigserial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  test_options text[] NOT NULL DEFAULT '{}',
  image text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read items"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert items"
  ON items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update items"
  ON items FOR UPDATE
  USING (true)
  WITH CHECK (true);
