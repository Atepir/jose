'use client';

import { useState } from 'react';

interface ReviewFormProps {
    experienceId: string;
    experienceTitle: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({ experienceId, experienceTitle, onReviewSubmitted }: ReviewFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        authorName: '',
        authorEmail: '',
        rating: 5,
        comment: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experienceId,
                    experienceTitle,
                    ...formData,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({
                    authorName: '',
                    authorEmail: '',
                    rating: 5,
                    comment: '',
                });
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-bold text-green-800 mb-2">Merci pour votre avis !</h3>
                <p className="text-green-600">
                    Votre avis a été soumis et sera publié après validation.
                </p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setIsOpen(false);
                    }}
                    className="mt-4 text-green-700 hover:text-green-800 font-semibold"
                >
                    Fermer
                </button>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-4 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
                <span className="text-xl">★</span>
                Laisser un avis
            </button>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Laisser un avis</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre nom *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Jean Dupont"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.authorEmail}
                        onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="jean@exemple.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note *
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className={`text-3xl transition ${star <= formData.rating ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre avis *
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Partagez votre expérience..."
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
