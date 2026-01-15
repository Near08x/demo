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

-- Policy: Allow all users (including anon) to read capital
CREATE POLICY "Allow all users to read capital"
ON capital FOR SELECT
USING (true);

-- Policy: Allow all users (including anon) to update capital
CREATE POLICY "Allow all users to update capital"
ON capital FOR UPDATE
USING (true);

-- Policy: Allow all users (including anon) to insert capital
CREATE POLICY "Allow all users to insert capital"
ON capital FOR INSERT
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
