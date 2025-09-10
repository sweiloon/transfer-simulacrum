-- Enable leaked password protection for enhanced security
-- This will prevent users from using passwords that have been found in data breaches

-- Note: This is a Supabase Auth configuration that needs to be enabled
-- through the Supabase Dashboard under Authentication > Settings > Password Security
-- The following is a documentation reminder for manual configuration:

-- Enable leaked password protection:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Authentication > Settings  
-- 3. Find "Password Security" section
-- 4. Enable "Leaked Password Protection"
-- 5. Set minimum password strength requirements

-- For now, we'll document this requirement
COMMENT ON SCHEMA public IS 'Security reminder: Enable leaked password protection in Supabase Auth settings';

-- Add a trigger to log security events (optional)
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log security-related events for audit purposes
  INSERT INTO public.security_logs (
    event_type,
    user_id,
    event_data,
    created_at
  ) VALUES (
    TG_OP,
    COALESCE(NEW.user_id, OLD.user_id),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now()
    ),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create security logs table for audit trail
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  event_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only allow administrators to view security logs
CREATE POLICY "Admins can view security logs" 
ON public.security_logs 
FOR SELECT 
USING (false); -- For now, restrict access completely

-- Add security trigger to profiles table
CREATE TRIGGER security_audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- Add security trigger to transfer_history table  
CREATE TRIGGER security_audit_transfers
  AFTER INSERT OR UPDATE OR DELETE ON public.transfer_history
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();