'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
    id: string;
    experienceId: string;
    experienceTitle: string;
    authorName: string;
    authorEmail: string;
    rating: number;
    comment: string;
    createdAt: Date;
    approved: boolean;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews?all=true');
            const data = await response.json();
            setReviews(data.reviews.map((r: Review) => ({
                ...r,
                createdAt: new Date(r.createdAt)
            })));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string, approved: boolean) => {
        try {
            const response = await fetch('/api/reviews', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, approved }),
            });

            if (response.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'pending') return !review.approved;
        if (filter === 'approved') return review.approved;
        return true;
    });

    const pendingCount = reviews.filter(r => !r.approved).length;
    const approvedCount = reviews.filter(r => r.approved).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des avis...</p>
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
                    <h1 className="text-4xl font-bold text-gray-800">
                        Gérer les Avis
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Approuvez ou supprimez les avis des clients
                    </p>
                </div>

                {/* Filtres */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                            ? 'bg-gray-800 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Tous ({reviews.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        En attente ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Approuvés ({approvedCount})
                    </button>
                </div>

                {/* Liste des avis */}
                {filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Aucun avis
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'pending'
                                ? 'Aucun avis en attente de validation.'
                                : filter === 'approved'
                                    ? 'Aucun avis approuvé.'
                                    : 'Aucun avis pour le moment.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${review.approved ? 'border-green-500' : 'border-amber-500'
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                                                {review.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{review.authorName}</h3>
                                                <p className="text-sm text-gray-500">{review.authorEmail}</p>
                                            </div>
                                            <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${review.approved
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {review.approved ? 'Approuvé' : 'En attente'}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <Link
                                                href={`/experiences/${review.experienceId}`}
                                                className="text-amber-600 hover:underline font-medium"
                                            >
                                                {review.experienceTitle}
                                            </Link>
                                        </div>

                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-lg ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">
                                            &quot;{review.comment}&quot;
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            {review.createdAt.toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 md:flex-col">
                                        {!review.approved && (
                                            <button
                                                onClick={() => handleApprove(review.id, true)}
                                                className="flex-1 md:flex-none bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition"
                                            >
                                                Approuver
                                            </button>
                                        )}
                                        {review.approved && (
                                            <button
                                                onClick={() => handleApprove(review.id, false)}
                                                className="flex-1 md:flex-none bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-200 transition"
                                            >
                                                Suspendre
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="flex-1 md:flex-none bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                                        >
                                            Supprimer
                                        </button>
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
