-- Supabase Database Schema for Samvaad App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('deaf', 'parent', 'teacher')),
  roll_number TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Email confirmation fields
  email_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- Deaf user specific fields
  proficiency TEXT CHECK (proficiency IN ('complete_beginner', 'knows_hand_signs', 'fluent_in_hand_signs', 'practice_only')),
  issues TEXT[],
  illness_stage TEXT,
  
  -- Parent user specific fields
  child_roll_number TEXT,
  relationship TEXT,
  purpose TEXT,
  
  -- Teacher user specific fields
  subjects TEXT[],
  teaching_purpose TEXT
);

-- Parent-Child Relationships Table
CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, child_id)
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_type, activity_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
-- Users table policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Admin can see all
CREATE POLICY "Service role can do anything" 
  ON users FOR ALL 
  USING (auth.role() = 'service_role');

-- Parent-child relationship policies
CREATE POLICY "Users can view their own relationships" 
  ON parent_child_relationships FOR SELECT 
  USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- User progress policies
CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create function to handle parent-child connections
CREATE OR REPLACE FUNCTION connect_parent_child(parent_roll TEXT, child_roll TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  parent_user_id UUID;
  child_user_id UUID;
BEGIN
  -- Get parent and child IDs
  SELECT id INTO parent_user_id FROM users WHERE roll_number = parent_roll AND role = 'parent';
  SELECT id INTO child_user_id FROM users WHERE roll_number = child_roll AND role = 'deaf';
  
  -- Check if both users exist
  IF parent_user_id IS NULL OR child_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Create relationship
  INSERT INTO parent_child_relationships (parent_id, child_id)
  VALUES (parent_user_id, child_user_id)
  ON CONFLICT (parent_id, child_id) DO NOTHING;
  
  -- Update parent's profile
  UPDATE users
  SET child_roll_number = child_roll
  WHERE id = parent_user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql; 