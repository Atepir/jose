'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';

const CATEGORIES = [
    { id: 'Événement', name: 'Événement', color: 'purple' },
    { id: 'Tourisme', name: 'Tourisme', color: 'green' },
    { id: 'Culture', name: 'Culture', color: 'amber' },
    { id: 'Partenariat', name: 'Partenariat', color: 'blue' },
    { id: 'Annonce', name: 'Annonce', color: 'red' },
];

type CategoryType = 'Événement' | 'Tourisme' | 'Culture' | 'Partenariat' | 'Annonce';

export default function AdminNewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        category: 'Événement' as CategoryType,
        publishedAt: new Date().toISOString().split('T')[0],
        published: false,
        featured: false,
        author: '',
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch('/api/news?all=true');
            const data = await response.json();
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingArticle ? 'PUT' : 'POST';
            const body = {
                ...formData,
                id: editingArticle?.id,
            };

            const response = await fetch('/api/news', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                alert(editingArticle ? 'Article modifié avec succès !' : 'Article créé avec succès !');
                setShowForm(false);
                setEditingArticle(null);
                fetchArticles();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            imageUrl: article.imageUrl || '',
            category: article.category,
            publishedAt: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            published: article.published,
            featured: article.featured,
            author: article.author || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        try {
            const response = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Article supprimé avec succès !');
                fetchArticles();
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Une erreur est survenue lors de la suppression.');
        }
    };

    const handleTogglePublish = async (article: NewsArticle) => {
        try {
            const response = await fetch('/api/news', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...article, published: !article.published }),
            });
            if (response.ok) fetchArticles();
        } catch (error) {
            console.error('Error toggling publish:', error);
        }
    };

    const handleToggleFeatured = async (article: NewsArticle) => {
        try {
            const response = await fetch('/api/news', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...article, featured: !article.featured }),
            });
            if (response.ok) fetchArticles();
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            imageUrl: '',
            category: 'Événement',
            publishedAt: new Date().toISOString().split('T')[0],
            published: false,
            featured: false,
            author: '',
        });
        setEditingArticle(null);
    };

    const filteredArticles = articles.filter(article => {
        if (filter === 'published') return article.published;
        if (filter === 'draft') return !article.published;
        return true;
    });

    const publishedCount = articles.filter(a => a.published).length;
    const draftCount = articles.filter(a => !a.published).length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des actualités...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="text-amber-600 hover:text-amber-700 font-semibold mb-4 inline-block"
                    >
                        ← Retour à l&apos;administration
                    </Link>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">
                                Actualités du Ministère
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gérez le feed d&apos;actualités affiché sur la page du Ministère
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                if (showForm) resetForm();
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            {showForm ? 'Annuler' : '+ Nouvel article'}
                        </button>
                    </div>
                </div>

                {/* Filtres */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Tous ({articles.length})
                    </button>
                    <button
                        onClick={() => setFilter('published')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'published' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Publiés ({publishedCount})
                    </button>
                    <button
                        onClick={() => setFilter('draft')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'draft' ? 'bg-amber-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Brouillons ({draftCount})
                    </button>
                </div>

                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {editingArticle ? 'Modifier l\'article' : 'Nouvel Article'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Titre *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Titre de l'article"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catégorie *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date de publication *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.publishedAt}
                                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Auteur
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Nom de l'auteur (optionnel)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL de l&apos;image
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Résumé * (affiché dans le feed)
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Court résumé de l'article..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenu complet *
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    placeholder="Contenu détaillé de l'article..."
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-gray-700">Publier immédiatement</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-gray-700">Mettre à la une</span>
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                                >
                                    {editingArticle ? 'Enregistrer les modifications' : 'Créer l\'article'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des articles */}
                {filteredArticles.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun article</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'Commencez par créer votre premier article d\'actualité.'
                                : filter === 'published'
                                    ? 'Aucun article publié pour le moment.'
                                    : 'Aucun brouillon en attente.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
                            >
                                <div className="flex gap-6">
                                    {article.imageUrl && (
                                        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                                                        {article.category}
                                                    </span>
                                                    {article.featured && (
                                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                            À la une
                                                        </span>
                                                    )}
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {article.published ? 'Publié' : 'Brouillon'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm mb-2">
                                                    {formatDate(article.publishedAt || article.createdAt)}
                                                    {article.author && ` • Par ${article.author}`}
                                                </p>
                                                <p className="text-gray-600 line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleTogglePublish(article)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${article.published
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {article.published ? 'Dépublier' : 'Publier'}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(article)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${article.featured
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {article.featured ? 'Retirer de la une' : 'Mettre à la une'}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
