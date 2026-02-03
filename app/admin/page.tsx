import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">
                    Administration
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <Link
                        href="/admin/experiences"
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition group"
                    >
                        <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition">
                            Gérer les Expériences
                        </h2>
                        <p className="text-gray-600">
                            Ajouter, modifier ou supprimer des expériences et activités
                        </p>
                    </Link>

                    <Link
                        href="/admin/bookings"
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition group"
                    >
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition">
                            Demandes de Réservation
                        </h2>
                        <p className="text-gray-600">
                            Consulter et gérer les demandes de réservation
                        </p>
                    </Link>

                    <Link
                        href="/admin/reviews"
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition group"
                    >
                        <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition">
                            Gérer les Avis
                        </h2>
                        <p className="text-gray-600">
                            Approuver ou supprimer les avis des clients
                        </p>
                    </Link>

                    <Link
                        href="/admin/news"
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition group"
                    >
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition">
                            Actualités du Ministère
                        </h2>
                        <p className="text-gray-600">
                            Gérer le feed d&apos;actualités de la page Ministère
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
