'use client';

import { useState } from 'react';

interface BookingFormProps {
    experienceId: string;
    experienceTitle: string;
    price: number;
}

export default function BookingForm({ experienceId, experienceTitle, price }: BookingFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        numberOfPeople: 1,
        preferredDate: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    experienceId,
                    experienceTitle,
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    numberOfPeople: 1,
                    preferredDate: '',
                    message: '',
                });
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalPrice = price * formData.numberOfPeople;

    if (isSubmitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Demande envoyée avec succès !
                </h3>
                <p className="text-green-700 mb-6">
                    Nous avons bien reçu votre demande de réservation.
                    Notre équipe vous contactera très prochainement pour confirmer les détails.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                    Faire une nouvelle demande
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Réserver cette expérience
            </h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Votre nom complet"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="votre@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+226 XX XX XX XX"
                    />
                </div>

                <div>
                    <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de personnes *
                    </label>
                    <input
                        type="number"
                        id="numberOfPeople"
                        required
                        min="1"
                        max="20"
                        value={formData.numberOfPeople}
                        onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Date souhaitée *
                    </label>
                    <input
                        type="date"
                        id="preferredDate"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message (optionnel)
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Informations complémentaires, questions..."
                    />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Prix par personne:</span>
                        <span className="font-semibold text-gray-800">
                            {price.toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Nombre de personnes:</span>
                        <span className="font-semibold text-gray-800">{formData.numberOfPeople}</span>
                    </div>
                    <div className="border-t border-amber-300 pt-2 mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total estimé:</span>
                        <span className="text-2xl font-bold text-amber-600">
                            {totalPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande de réservation'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                    * Champs obligatoires. Nous vous recontacterons pour confirmer votre réservation.
                </p>
            </div>
        </form>
    );
}
