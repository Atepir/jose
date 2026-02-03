'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';

export default function MinisterePage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { value: 'all', label: 'Toutes les actualités' },
        { value: 'Événement', label: 'Événements' },
        { value: 'Tourisme', label: 'Tourisme' },
        { value: 'Culture', label: 'Culture' },
        { value: 'Partenariat', label: 'Partenariats' },
        { value: 'Annonce', label: 'Annonces' }
    ];

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch('/api/news?published=true');
            if (res.ok) {
                const data = await res.json();
                setFeaturedArticles(data.filter((a: NewsArticle) => a.featured));
                setArticles(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des actualités:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = selectedCategory === 'all'
        ? articles.filter(a => !a.featured)
        : articles.filter(a => a.category === selectedCategory && !a.featured);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Événement': 'bg-purple-100 text-purple-700',
            'Tourisme': 'bg-green-100 text-green-700',
            'Culture': 'bg-amber-100 text-amber-700',
            'Partenariat': 'bg-blue-100 text-blue-700',
            'Annonce': 'bg-red-100 text-red-700'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[350px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/image.png"
                        alt="Monument des Martyrs - Ouagadougou, Burkina Faso"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                        <span className="text-sm font-semibold">Partenaire Officiel</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Ministère du Tourisme et de la Culture
                    </h1>
                    <p className="text-xl text-white/90">
                        Actualités et Informations - Burkina Faso
                    </p>
                </div>
            </section>

            {/* Actualités à la Une */}
            {featuredArticles.length > 0 && (
                <section className="py-12 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800">
                            À la Une
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {featuredArticles.slice(0, 2).map((article) => (
                                <article
                                    key={article.id}
                                    className="group bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
                                >
                                    <div className="relative h-64">
                                        <Image
                                            src={article.imageUrl || 'https://images.unsplash.com/photo-1569838438570-87eb3f259d58?w=800'}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-sm text-gray-500 mb-2">
                                            {formatDate(article.publishedAt || article.createdAt)}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-amber-600 transition line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filtres et Liste des Actualités */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Toutes les Actualités
                        </h2>

                        {/* Filtres par catégorie */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat.value
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-amber-50'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune actualité</h3>
                            <p className="text-gray-600">
                                {selectedCategory === 'all'
                                    ? 'Aucune actualité n\'a encore été publiée.'
                                    : `Aucune actualité dans la catégorie "${selectedCategory}".`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={article.imageUrl || 'https://images.unsplash.com/photo-1569838438570-87eb3f259d58?w=600'}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-sm text-gray-500 mb-2">
                                            {formatDate(article.publishedAt || article.createdAt)}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section Partenariat */}
            <section className="py-16 px-4 bg-amber-700 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                        <span className="font-semibold">Partenariat Officiel</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-6">
                        KUUNI × Ministère du Tourisme
                    </h2>
                    <p className="text-lg mb-8 opacity-90 leading-relaxed">
                        KUUNI est fier de collaborer avec le Ministère du Tourisme et de la Culture
                        pour offrir des expériences touristiques authentiques et contribuer au
                        rayonnement du patrimoine burkinabè.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/experiences"
                            className="inline-block bg-white text-amber-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition"
                        >
                            Découvrir nos expériences
                        </Link>
                        <Link
                            href="/a-propos"
                            className="inline-block bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition"
                        >
                            En savoir plus sur KUUNI
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                        Contact du Ministère
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Adresse</h3>
                            <p className="text-gray-600">
                                Ministère de la Culture, des Arts et du Tourisme<br />
                                Avenue de l&apos;Indépendance<br />
                                01 BP 2093 Ouagadougou 01<br />
                                Burkina Faso
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Coordonnées</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>info@culture.gov.bf</li>
                                <li>+226 25 33 09 63</li>
                                <li>www.culture.gov.bf</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
