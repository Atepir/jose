export interface Experience {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    city: 'Ouagadougou' | 'Bobo-Dioulasso';
    type: 'experience' | 'activity';
    category: string;
    group?: string; // Groupe pour regrouper les expériences (ex: "Spa", "Culture", "Gastronomie")
    price: number;
    duration: string;
    images: string[];
    highlights: string[];
    included: string[];
    notIncluded: string[];
    createdAt: Date;
    featured: boolean;
}

export interface BookingRequest {
    id: string;
    experienceId: string;
    experienceTitle: string;
    name: string;
    email: string;
    phone: string;
    numberOfPeople: number;
    preferredDate: string;
    message: string;
    createdAt: Date;
    status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
}

export interface Review {
    id: string;
    experienceId: string;
    experienceTitle: string;
    authorName: string;
    authorEmail: string;
    rating: number; // 1-5 étoiles
    comment: string;
    createdAt: Date;
    approved: boolean; // Les avis doivent être approuvés avant publication
}

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string; // Résumé court de l'article
    content: string;
    imageUrl?: string;
    category: 'Événement' | 'Tourisme' | 'Culture' | 'Partenariat' | 'Annonce';
    publishedAt?: string;
    createdAt: string;
    published: boolean; // true = publié, false = brouillon
    featured: boolean; // Article mis en avant
    author?: string;
}
