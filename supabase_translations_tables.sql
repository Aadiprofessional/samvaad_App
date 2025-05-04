-- Create translation history table
CREATE TABLE public.translations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    source_language TEXT DEFAULT 'asl',
    target_language TEXT DEFAULT 'english',
    confidence FLOAT,
    
    -- Add any additional metadata fields here
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create index for faster queries by user
CREATE INDEX translations_user_id_idx ON public.translations(user_id);
CREATE INDEX translations_created_at_idx ON public.translations(created_at);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own translation history
CREATE POLICY "Users can view their own translations" 
    ON public.translations 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own translations" 
    ON public.translations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own translations" 
    ON public.translations 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own translations" 
    ON public.translations 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create a view for favorite/saved translations (optional)
CREATE TABLE public.saved_translations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    translation_id BIGINT NOT NULL REFERENCES public.translations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    notes TEXT,
    
    -- Ensure each translation is saved only once per user
    UNIQUE(user_id, translation_id)
);

-- Set up RLS for saved translations
ALTER TABLE public.saved_translations ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own saved translations
CREATE POLICY "Users can view their own saved translations" 
    ON public.saved_translations 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved translations" 
    ON public.saved_translations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved translations" 
    ON public.saved_translations 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved translations" 
    ON public.saved_translations 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create view for easier querying of translations with saving status
CREATE OR REPLACE VIEW public.user_translations AS
SELECT 
    t.id,
    t.user_id,
    t.text,
    t.image_url,
    t.created_at,
    t.source_language,
    t.target_language,
    t.confidence,
    t.metadata,
    CASE WHEN st.id IS NOT NULL THEN true ELSE false END AS is_saved,
    st.notes AS saved_notes
FROM
    public.translations t
LEFT JOIN
    public.saved_translations st ON t.id = st.translation_id AND t.user_id = st.user_id;

-- Create appropriate permissions for the view
CREATE POLICY "Users can view their own translations in the view" 
    ON public.user_translations 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Set up storage bucket rules for translation images
-- Note: This assumes you already have the 'profileimages' bucket set up
INSERT INTO storage.buckets (id, name, public) VALUES ('translations', 'translations', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the translations bucket
CREATE POLICY "Users can view their own translation images" 
    ON storage.objects 
    FOR SELECT 
    USING (
        bucket_id = 'profileimages' 
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (storage.foldername(name))[2] = 'translation'
    );

CREATE POLICY "Users can upload their own translation images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'profileimages' 
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (storage.foldername(name))[2] = 'translation'
    );

CREATE POLICY "Users can update their own translation images" 
    ON storage.objects 
    FOR UPDATE 
    USING (
        bucket_id = 'profileimages' 
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (storage.foldername(name))[2] = 'translation'
    );

CREATE POLICY "Users can delete their own translation images" 
    ON storage.objects 
    FOR DELETE 
    USING (
        bucket_id = 'profileimages' 
        AND (storage.foldername(name))[1] = auth.uid()::text
        AND (storage.foldername(name))[2] = 'translation'
    );

-- Function to save a translation
CREATE OR REPLACE FUNCTION public.save_translation(
    p_text TEXT,
    p_image_url TEXT DEFAULT NULL,
    p_source_language TEXT DEFAULT 'asl',
    p_target_language TEXT DEFAULT 'english',
    p_confidence FLOAT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_translation_id BIGINT;
BEGIN
    -- Only allow authenticated users
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Insert the translation and return the ID
    INSERT INTO public.translations (
        user_id,
        text,
        image_url,
        source_language,
        target_language,
        confidence,
        metadata
    ) VALUES (
        auth.uid(),
        p_text,
        p_image_url,
        p_source_language,
        p_target_language,
        p_confidence,
        p_metadata
    )
    RETURNING id INTO v_translation_id;
    
    RETURN v_translation_id;
END;
$$; 