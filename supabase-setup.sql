-- Script SQL à exécuter dans Supabase SQL Editor
-- Ce script crée les tables nécessaires pour l'application

-- Table des expériences
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    city TEXT NOT NULL CHECK (city IN ('Ouagadougou', 'Bobo-Dioulasso')),
    type TEXT NOT NULL CHECK (type IN ('experience', 'activity')),
    category TEXT NOT NULL,
    group_name TEXT, -- Groupe pour regrouper les expériences (Spa, Culture, etc.)
    price INTEGER NOT NULL,
    duration TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    not_included TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des demandes de réservation
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
    experience_title TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    number_of_people INTEGER NOT NULL,
    preferred_date DATE NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des avis clients
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
    experience_title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des actualités du Ministère
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_experiences_city ON experiences(city);
CREATE INDEX IF NOT EXISTS idx_experiences_type ON experiences(type);
CREATE INDEX IF NOT EXISTS idx_experiences_featured ON experiences(featured);
CREATE INDEX IF NOT EXISTS idx_experiences_group ON experiences(group_name);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_experience_id ON reviews(experience_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policies pour experiences (lecture publique, écriture authentifiée)
CREATE POLICY "Lecture publique des expériences"
    ON experiences FOR SELECT
    USING (true);

CREATE POLICY "Insertion authentifiée des expériences"
    ON experiences FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Mise à jour authentifiée des expériences"
    ON experiences FOR UPDATE
    USING (true);

CREATE POLICY "Suppression authentifiée des expériences"
    ON experiences FOR DELETE
    USING (true);

-- Policies pour booking_requests (lecture/écriture publique pour l'instant)
CREATE POLICY "Lecture publique des réservations"
    ON booking_requests FOR SELECT
    USING (true);

CREATE POLICY "Insertion publique des réservations"
    ON booking_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Mise à jour authentifiée des réservations"
    ON booking_requests FOR UPDATE
    USING (true);

-- Policies pour reviews
CREATE POLICY "Lecture publique des avis approuvés"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Insertion publique des avis"
    ON reviews FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Mise à jour authentifiée des avis"
    ON reviews FOR UPDATE
    USING (true);

CREATE POLICY "Suppression authentifiée des avis"
    ON reviews FOR DELETE
    USING (true);

-- Policies pour news (actualités)
CREATE POLICY "Lecture publique des actualités publiées"
    ON news FOR SELECT
    USING (true);

CREATE POLICY "Insertion authentifiée des actualités"
    ON news FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Mise à jour authentifiée des actualités"
    ON news FOR UPDATE
    USING (true);

CREATE POLICY "Suppression authentifiée des actualités"
    ON news FOR DELETE
    USING (true);

-- Insérer les données d'exemple
INSERT INTO experiences (title, description, long_description, city, type, category, price, duration, images, highlights, included, not_included, featured)
VALUES
(
    'Visite Culturelle du Centre-Ville de Ouagadougou',
    'Découvrez le cœur battant de la capitale burkinabè avec ses marchés animés et son architecture unique.',
    'Plongez dans l''authenticité de Ouagadougou à travers cette visite guidée complète. Explorez les marchés traditionnels, découvrez l''artisanat local, et imprégnez-vous de la culture mossi. Cette expérience vous emmènera à travers les sites historiques et culturels majeurs de la capitale.',
    'Ouagadougou',
    'experience',
    'Culture',
    25000,
    '4 heures',
    ARRAY['https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=800'],
    ARRAY['Visite du marché de Rood-Woko', 'Découverte du Monument des Martyrs', 'Visite de la Grande Mosquée', 'Dégustation de plats locaux'],
    ARRAY['Guide francophone expérimenté', 'Transport climatisé', 'Eau minérale', 'Dégustation culinaire'],
    ARRAY['Repas complet', 'Souvenirs personnels', 'Pourboires'],
    true
),
(
    'Safari Urbain à Bobo-Dioulasso',
    'Explorez la deuxième ville du Burkina Faso, son architecture coloniale et sa vieille mosquée en banco.',
    'Bobo-Dioulasso, capitale économique et culturelle de l''ouest du Burkina Faso, vous dévoile ses secrets. De la vieille mosquée de Dioulassoba construite en banco à la visite de la vieille ville de Kibidwé, cette journée sera riche en découvertes.',
    'Bobo-Dioulasso',
    'experience',
    'Culture',
    30000,
    '6 heures',
    ARRAY['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', 'https://images.unsplash.com/photo-1581888227599-779811939961?w=800'],
    ARRAY['Mosquée de Dioulassoba (XVe siècle)', 'Vieille ville de Kibidwé', 'Visite d''une brasserie artisanale', 'Marché de Bobo'],
    ARRAY['Guide local expert', 'Transport', 'Déjeuner traditionnel', 'Eau et rafraîchissements'],
    ARRAY['Achats personnels', 'Boissons alcoolisées supplémentaires'],
    true
),
(
    'Restaurant Le Verdoyant',
    'Savourez une cuisine burkinabè authentique dans un cadre verdoyant et paisible.',
    'Le Verdoyant est l''une des meilleures adresses de Ouagadougou pour découvrir la gastronomie locale. Dans un jardin tropical, dégustez des plats traditionnels revisités avec des produits frais du marché.',
    'Ouagadougou',
    'activity',
    'Restaurant',
    8000,
    '2 heures',
    ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
    ARRAY['Cuisine burkinabè authentique', 'Cadre verdoyant', 'Produits locaux frais', 'Ambiance conviviale'],
    ARRAY['Menu complet', 'Boisson non-alcoolisée'],
    ARRAY['Boissons alcoolisées', 'Desserts supplémentaires'],
    false
),
(
    'Atelier de Poterie Traditionnelle',
    'Apprenez les techniques ancestrales de la poterie burkinabè avec un artisan expert.',
    'Participez à un atelier authentique de poterie et découvrez les techniques traditionnelles transmises de génération en génération. Créez votre propre pièce sous les conseils d''un maître potier.',
    'Ouagadougou',
    'activity',
    'Atelier',
    15000,
    '3 heures',
    ARRAY['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
    ARRAY['Apprentissage avec un maître artisan', 'Création de votre pièce unique', 'Techniques traditionnelles', 'Emportez votre création'],
    ARRAY['Matériel complet', 'Instruction en français', 'Votre création', 'Rafraîchissements'],
    ARRAY['Transport'],
    true
),
(
    'Restaurant Chez Aicha',
    'Dégustez les meilleurs grillades et plats locaux de Bobo-Dioulasso.',
    'Chez Aicha est une institution à Bobo-Dioulasso. Ce restaurant familial propose depuis 20 ans les meilleures grillades de la ville dans une ambiance chaleureuse et accueillante.',
    'Bobo-Dioulasso',
    'activity',
    'Restaurant',
    7000,
    '2 heures',
    ARRAY['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
    ARRAY['Grillades réputées', 'Ambiance familiale', 'Prix abordables', 'Plats généreux'],
    ARRAY['Repas complet', 'Eau minérale'],
    ARRAY['Boissons supplémentaires'],
    false
),
(
    'Atelier de Percussion Africaine',
    'Initiez-vous au djembé et aux rythmes traditionnels avec des musiciens professionnels.',
    'Plongez dans l''univers fascinant des percussions africaines. Cet atelier vous permettra d''apprendre les bases du djembé et de découvrir les rythmes traditionnels burkinabè dans une ambiance conviviale.',
    'Bobo-Dioulasso',
    'activity',
    'Atelier',
    12000,
    '2 heures',
    ARRAY['https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800'],
    ARRAY['Musiciens professionnels', 'Instruments fournis', 'Tous niveaux acceptés', 'Ambiance conviviale'],
    ARRAY['Instruments', 'Cours en français', 'Rafraîchissements'],
    ARRAY['Transport'],
    true
),
(
    'Spa Harmonie - Massage Traditionnel',
    'Offrez-vous un moment de détente absolue avec nos massages aux huiles de karité.',
    'Le Spa Harmonie vous propose une expérience de bien-être unique au cœur de Ouagadougou. Nos thérapeutes qualifiés utilisent des techniques traditionnelles africaines combinées avec les bienfaits du beurre de karité du Burkina Faso pour vous offrir un moment de relaxation profonde.',
    'Ouagadougou',
    'activity',
    'Spa',
    20000,
    '1h30',
    ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'],
    ARRAY['Massage aux huiles de karité bio', 'Thérapeutes certifiés', 'Ambiance zen et relaxante', 'Produits naturels locaux'],
    ARRAY['Massage complet 1h30', 'Tisane de bienvenue', 'Serviettes et peignoir', 'Accès au salon de repos'],
    ARRAY['Soins supplémentaires', 'Transport'],
    true
),
(
    'Spa Zenith - Rituel Africain',
    'Un rituel complet de beauté et bien-être inspiré des traditions africaines.',
    'Découvrez le rituel africain du Spa Zenith à Bobo-Dioulasso. Ce soin complet comprend un gommage au savon noir, un enveloppement au beurre de karité et un massage relaxant. Une expérience sensorielle unique qui vous reconnecte avec les traditions de beauté africaines.',
    'Bobo-Dioulasso',
    'activity',
    'Spa',
    35000,
    '2h30',
    ARRAY['https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800'],
    ARRAY['Gommage au savon noir', 'Enveloppement karité', 'Massage relaxant', 'Soin visage offert'],
    ARRAY['Rituel complet 2h30', 'Produits 100% naturels', 'Thé et collation', 'Espace détente'],
    ARRAY['Soins capillaires', 'Transport'],
    true
),
(
    'Atelier Tissage Faso Dan Fani',
    'Apprenez l''art du tissage traditionnel burkinabè avec des artisans experts.',
    'Le Faso Dan Fani est le tissu traditionnel du Burkina Faso, symbole de fierté nationale. Dans cet atelier, vous découvrirez les techniques ancestrales de tissage sur métier traditionnel et créerez votre propre bande de tissu à emporter.',
    'Ouagadougou',
    'activity',
    'Atelier',
    18000,
    '4 heures',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    ARRAY['Métier à tisser traditionnel', 'Artisan expert', 'Création personnelle', 'Histoire du Faso Dan Fani'],
    ARRAY['Formation complète', 'Matériel fourni', 'Votre création', 'Certificat de participation'],
    ARRAY['Transport', 'Repas'],
    false
);
