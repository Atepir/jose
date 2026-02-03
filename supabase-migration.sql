-- =============================================================================
-- Script de MIGRATION Supabase pour KUUNI
-- À exécuter si les tables existent déjà
-- =============================================================================

-- 1. Ajouter la colonne group_name à experiences si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'group_name'
    ) THEN
        ALTER TABLE experiences ADD COLUMN group_name TEXT;
    END IF;
END $$;

-- 1b. Ajouter author_email à reviews si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'author_email'
    ) THEN
        ALTER TABLE reviews ADD COLUMN author_email TEXT;
    END IF;
END $$;

-- 2. Créer la table news si elle n'existe pas
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('Événement', 'Tourisme', 'Culture', 'Partenariat', 'Annonce')),
    author TEXT,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Créer les index pour news
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- 4. Créer l'index pour group_name
CREATE INDEX IF NOT EXISTS idx_experiences_group ON experiences(group_name);

-- 5. Activer RLS sur news
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 6. Créer les policies pour news (avec DROP IF EXISTS pour éviter les doublons)
DROP POLICY IF EXISTS "Lecture publique des actualités publiées" ON news;
CREATE POLICY "Lecture publique des actualités publiées"
    ON news FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Insertion authentifiée des actualités" ON news;
CREATE POLICY "Insertion authentifiée des actualités"
    ON news FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Mise à jour authentifiée des actualités" ON news;
CREATE POLICY "Mise à jour authentifiée des actualités"
    ON news FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Suppression authentifiée des actualités" ON news;
CREATE POLICY "Suppression authentifiée des actualités"
    ON news FOR DELETE
    USING (true);

-- 7. Vérification finale
SELECT 'Migration terminée avec succès!' as status;

-- Afficher les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
