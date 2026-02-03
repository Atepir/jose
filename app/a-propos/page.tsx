import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=1920"
                        alt="À propos"
                        fill
                        className="object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        À Propos de Nous
                    </h1>
                    <p className="text-xl">Notre mission et nos valeurs</p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                        Notre Mission
                    </h2>
                    <div className="text-lg text-gray-700 space-y-6 leading-relaxed">
                        <p>
                            Kuuni est née d&apos;une passion profonde pour notre pays,
                            le Burkina Faso, et d&apos;un désir de partager ses richesses culturelles,
                            gastronomiques et artisanales avec le monde.
                        </p>
                        <p>
                            Notre mission est de créer des ponts entre les visiteurs et l&apos;authenticité
                            burkinabè. Nous croyons que le véritable voyage commence lorsqu&apos;on sort
                            des sentiers battus pour vivre des expériences authentiques, rencontrer
                            les artisans locaux, et découvrir les saveurs traditionnelles de notre terroir.
                        </p>
                        <p>
                            Basés entre Ouagadougou et Bobo-Dioulasso, nous travaillons en étroite
                            collaboration avec des guides locaux, des artisans passionnés, et des
                            restaurateurs qui perpétuent les traditions culinaires de nos régions.
                        </p>
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800 text-center">
                        Ce Que Nous Proposons
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                Visites Culturelles
                            </h3>
                            <p className="text-gray-600">
                                Découvrez l&apos;histoire et la culture du Burkina Faso à travers des
                                visites guidées de nos monuments, marchés traditionnels et sites historiques.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                Ateliers Artisanaux
                            </h3>
                            <p className="text-gray-600">
                                Participez à des ateliers avec des artisans locaux pour apprendre
                                les techniques traditionnelles de poterie, tissage, percussion et plus encore.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                Gastronomie Locale
                            </h3>
                            <p className="text-gray-600">
                                Savourez la cuisine burkinabè authentique dans nos restaurants partenaires
                                et découvrez les saveurs uniques de notre terroir.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                Rencontres Authentiques
                            </h3>
                            <p className="text-gray-600">
                                Échangez avec les populations locales et découvrez leur mode de vie,
                                leurs traditions et leur hospitalité légendaire.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800 text-center">
                        Nos Valeurs
                    </h2>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Authenticité</h3>
                                <p className="text-gray-600">
                                    Nous privilégions les expériences authentiques qui reflètent la véritable
                                    culture burkinabè, loin du tourisme de masse.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Respect</h3>
                                <p className="text-gray-600">
                                    Nous respectons les traditions locales, l&apos;environnement et travaillons
                                    dans un esprit de collaboration avec nos partenaires.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Qualité</h3>
                                <p className="text-gray-600">
                                    Chaque expérience est soigneusement sélectionnée et organisée pour garantir
                                    la meilleure qualité à nos visiteurs.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                4
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Impact Local</h3>
                                <p className="text-gray-600">
                                    Nous soutenons l&apos;économie locale en travaillant avec des artisans,
                                    guides et restaurants burkinabè.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-amber-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Rejoignez-nous dans cette aventure
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Découvrez le Burkina Faso comme vous ne l&apos;avez jamais vu
                    </p>
                    <a
                        href="/experiences"
                        className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Voir nos expériences
                    </a>
                </div>
            </section>
        </div>
    );
}
