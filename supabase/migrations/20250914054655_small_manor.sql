/*
  # Fix user profiles consistency and data integrity

  1. Data Fixes
    - Ensure all user profiles have proper default values
    - Fix any null values that should have defaults
    - Add missing indexes for better performance

  2. Constraints
    - Add proper constraints for data integrity
    - Ensure consistent field naming

  3. Updates
    - Update existing records with missing data
    - Standardize coin/money fields
*/

-- Update existing profiles to have consistent data
UPDATE user_profiles 
SET 
  total_coins = COALESCE(total_coins, money, 100),
  money = COALESCE(money, total_coins, 100),
  name = COALESCE(name, full_name, 'Student'),
  full_name = COALESCE(full_name, name, 'Student'),
  unlocked_chapters = COALESCE(unlocked_chapters, ARRAY['class9_ch1']),
  total_correct = COALESCE(total_correct, total_correct_answers, 0),
  total_correct_answers = COALESCE(total_correct_answers, total_correct, 0),
  diagnostic_completed = COALESCE(diagnostic_completed, false),
  avatar_id = COALESCE(avatar_id, 1)
WHERE 
  total_coins IS NULL 
  OR money IS NULL 
  OR name IS NULL 
  OR name = ''
  OR unlocked_chapters IS NULL 
  OR array_length(unlocked_chapters, 1) IS NULL;

-- Add function to automatically sync coin fields
CREATE OR REPLACE FUNCTION sync_coin_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure both coin fields are always in sync
  IF NEW.total_coins IS NOT NULL AND NEW.money IS NULL THEN
    NEW.money = NEW.total_coins;
  ELSIF NEW.money IS NOT NULL AND NEW.total_coins IS NULL THEN
    NEW.total_coins = NEW.money;
  ELSIF NEW.total_coins IS NOT NULL AND NEW.money IS NOT NULL AND NEW.total_coins != NEW.money THEN
    -- Use the higher value to prevent data loss
    NEW.money = GREATEST(NEW.total_coins, NEW.money);
    NEW.total_coins = NEW.money;
  END IF;
  
  -- Ensure name fields are synced
  IF NEW.name IS NOT NULL AND NEW.full_name IS NULL THEN
    NEW.full_name = NEW.name;
  ELSIF NEW.full_name IS NOT NULL AND NEW.name IS NULL THEN
    NEW.name = NEW.full_name;
  END IF;
  
  -- Ensure correct answer fields are synced
  IF NEW.total_correct IS NOT NULL AND NEW.total_correct_answers IS NULL THEN
    NEW.total_correct_answers = NEW.total_correct;
  ELSIF NEW.total_correct_answers IS NOT NULL AND NEW.total_correct IS NULL THEN
    NEW.total_correct = NEW.total_correct_answers;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync fields
DROP TRIGGER IF EXISTS sync_user_profile_fields ON user_profiles;
CREATE TRIGGER sync_user_profile_fields
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_coin_fields();

-- Add constraints to prevent invalid data
DO $$
BEGIN
  -- Add check constraint for class level if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' 
    AND constraint_name = 'user_profiles_class_level_valid'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_class_level_valid 
    CHECK (class_level >= 1 AND class_level <= 12);
  END IF;
  
  -- Add check constraint for non-negative coins
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' 
    AND constraint_name = 'user_profiles_coins_non_negative'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_coins_non_negative 
    CHECK (total_coins >= 0 AND money >= 0);
  END IF;
END $$;

-- Ensure all users have at least one unlocked chapter
UPDATE user_profiles 
SET unlocked_chapters = ARRAY['class9_ch1']
WHERE unlocked_chapters IS NULL 
   OR array_length(unlocked_chapters, 1) IS NULL 
   OR array_length(unlocked_chapters, 1) = 0;