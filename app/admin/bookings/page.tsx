'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookingRequest } from '@/types';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'confirmed' | 'cancelled'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            setBookings(data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const sortedBookings = [...filteredBookings].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const getStatusBadge = (status: BookingRequest['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            contacted: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        const labels = {
            pending: 'En attente',
            contacted: 'Contacté',
            confirmed: 'Confirmé',
            cancelled: 'Annulé',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des demandes...</p>
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
                        Demandes de Réservation
                    </h1>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'all'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Toutes ({bookings.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'pending'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            En attente ({bookings.filter(b => b.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setFilter('contacted')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'contacted'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Contactés ({bookings.filter(b => b.status === 'contacted').length})
                        </button>
                        <button
                            onClick={() => setFilter('confirmed')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${filter === 'confirmed'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Confirmés ({bookings.filter(b => b.status === 'confirmed').length})
                        </button>
                    </div>
                </div>

                {/* Bookings List */}
                {sortedBookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Aucune demande
                        </h2>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'Aucune demande de réservation pour le moment.'
                                : `Aucune demande avec le statut "${filter}".`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {booking.experienceTitle}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Demande reçue le {new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nom</p>
                                        <p className="font-semibold text-gray-800">{booking.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="font-semibold text-gray-800">
                                            <a href={`mailto:${booking.email}`} className="text-amber-600 hover:underline">
                                                {booking.email}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                                        <p className="font-semibold text-gray-800">
                                            <a href={`tel:${booking.phone}`} className="text-amber-600 hover:underline">
                                                {booking.phone}
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Nombre de personnes</p>
                                        <p className="font-semibold text-gray-800">{booking.numberOfPeople}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Date souhaitée</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(booking.preferredDate).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {booking.message && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-gray-500 mb-1">Message</p>
                                        <p className="text-gray-800">{booking.message}</p>
                                    </div>
                                )}

                                <div className="flex gap-2 flex-wrap">
                                    <a
                                        href={`mailto:${booking.email}?subject=Votre demande de réservation - ${booking.experienceTitle}`}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition inline-block"
                                    >
                                        Envoyer un email
                                    </a>
                                    <a
                                        href={`tel:${booking.phone}`}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition inline-block"
                                    >
                                        Appeler
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
