-- Migration: Create tree_hierarchies table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard

-- Create the tree_hierarchies table
CREATE TABLE IF NOT EXISTS tree_hierarchies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'root',
    tree_data TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_tree_hierarchies_created_at 
ON tree_hierarchies(created_at DESC);

-- Create a function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_tree_hierarchies_updated_at ON tree_hierarchies;
CREATE TRIGGER update_tree_hierarchies_updated_at
    BEFORE UPDATE ON tree_hierarchies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a sample tree (optional)
INSERT INTO tree_hierarchies (name, tree_data) VALUES (
    'root',
    '{"name": "root", "children": [{"name": "child1", "children": [{"name": "child1-child1", "data": "c1-c1 Hello"}, {"name": "child1-child2", "data": "c1-c2 JS"}]}, {"name": "child2", "data": "c2 World"}]}'
);

-- Verify table was created
SELECT * FROM tree_hierarchies;
