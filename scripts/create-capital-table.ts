import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCapitalTable() {
  console.log('Creating capital table...');

  // Check if table exists by trying to select from it
  const { error: checkError } = await supabase
    .from('capital')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('✅ Capital table already exists');
    return;
  }

  console.log('Table does not exist, you need to run the SQL script manually in Supabase SQL Editor.');
  console.log('\nPlease run the following SQL in Supabase SQL Editor:');
  console.log('\n---\n');
  console.log(`
-- Create capital table to track available capital
CREATE TABLE IF NOT EXISTS capital (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total NUMERIC(12, 2) NOT NULL DEFAULT 100000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial capital if not exists
INSERT INTO capital (id, total)
VALUES (1, 100000.00)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies
ALTER TABLE capital ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read capital
CREATE POLICY "Allow authenticated users to read capital"
ON capital FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow all authenticated users to update capital
CREATE POLICY "Allow authenticated users to update capital"
ON capital FOR UPDATE
TO authenticated
USING (true);

-- Policy: Allow all authenticated users to insert capital
CREATE POLICY "Allow authenticated users to insert capital"
ON capital FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_capital_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER capital_updated_at
BEFORE UPDATE ON capital
FOR EACH ROW
EXECUTE FUNCTION update_capital_updated_at();
  `);
  console.log('\n---\n');
}

createCapitalTable().catch(console.error);
