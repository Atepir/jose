import Link from 'next/link';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { experiences as localExperiences } from '@/lib/data';

export const revalidate = 0;

async function getFeaturedExperiences() {
    if (isSupabaseConfigured && supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: experiences } = await (supabase as any)
            .from('experiences')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(6);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return experiences?.map((exp: any) => ({
            id: exp.id,
            title: exp.title,
            description: exp.description,
            longDescription: exp.long_description,
            city: exp.city,
            type: exp.type,
            category: exp.category,
            price: exp.price,
            duration: exp.duration,
            images: exp.images || [],
            highlights: exp.highlights || [],
            included: exp.included || [],
            notIncluded: exp.not_included || [],
            createdAt: new Date(exp.created_at),
            featured: exp.featured,
        })) || [];
    }

    return localExperiences
        .filter(exp => exp.featured)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 6);
}

async function getReviews() {
    if (isSupabaseConfigured && supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: reviews } = await (supabase as any)
            .from('reviews')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false })
            .limit(6);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return reviews?.map((review: any) => ({
            id: review.id,
            experienceId: review.experience_id,
            experienceTitle: review.experience_title,
            authorName: review.author_name,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(review.created_at),
        })) || [];
    }
    return [];
}

export default async function Home() {
    const featuredExperiences = await getFeaturedExperiences();
    const reviews = await getReviews();

    return (
        <div className="min-h-screen">
            {/* Hero Section avec Vidéo */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Video Background - utiliser une vidéo YouTube ou locale */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
                    <Image
                        src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920"
                        alt="Burkina Faso - Sites touristiques"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-5xl">
                    <div className="mb-6">
                        {/* Emplacement pour le logo KUUNI - remplacer par le vrai logo de Canva */}
                        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 mb-6">
                            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                                <span className="text-white">KU</span>
                                <span className="text-amber-500">UNI</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-2xl md:text-3xl mb-4 font-light">
                        Vivez l&apos;authenticité du <span className="font-semibold">Burkina Faso</span>
                    </p>
                    <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Découvrez le Pays des Hommes Intègres à travers des expériences culturelles,
                        gastronomiques et artisanales uniques
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/experiences"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
                        >
                            Découvrir nos expériences
                        </Link>
                        <Link
                            href="/a-propos"
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-10 py-4 rounded-lg text-lg font-semibold transition border border-white/30"
                        >
                            En savoir plus
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-white/80 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Section Vidéo Burkina Faso */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Découvrez le Burkina Faso
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Un aperçu des merveilles qui vous attendent au Pays des Hommes Intègres
                        </p>
                    </div>

                    {/* Video Container - Placeholder pour une vidéo YouTube */}
                    <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-gray-900/50 z-10 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm cursor-pointer hover:bg-white/30 transition">
                                    <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-white border-b-[20px] border-b-transparent ml-2"></div>
                                </div>
                                <p className="text-lg opacity-75">Vidéo à venir - Sites touristiques du BF</p>
                            </div>
                        </div>
                        <Image
                            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1280"
                            alt="Sites touristiques Burkina Faso"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Points forts */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                        {[
                            { title: 'Culture', desc: 'Patrimoine riche' },
                            { title: 'Gastronomie', desc: 'Saveurs locales' },
                            { title: 'Artisanat', desc: 'Savoir-faire' },
                            { title: 'Nature', desc: 'Paysages uniques' },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Activités à faire */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Que faire au Burkina Faso ?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Des expériences authentiques pour tous les goûts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Spa & Bien-être',
                                description: 'Relaxation et soins traditionnels dans les meilleurs spas',
                                image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
                                color: 'from-pink-500 to-rose-600'
                            },
                            {
                                title: 'Gastronomie locale',
                                description: 'Dégustez les plats traditionnels burkinabè',
                                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
                                color: 'from-orange-500 to-amber-600'
                            },
                            {
                                title: 'Ateliers artisanaux',
                                description: 'Apprenez les techniques des artisans locaux',
                                image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600',
                                color: 'from-purple-500 to-violet-600'
                            },
                            {
                                title: 'Visites culturelles',
                                description: 'Découvrez les sites historiques et musées',
                                image: 'https://images.unsplash.com/photo-1569838438570-87eb3f259d58?w=600',
                                color: 'from-amber-500 to-yellow-600'
                            },
                            {
                                title: 'Excursions nature',
                                description: 'Explorez les paysages magnifiques du pays',
                                image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600',
                                color: 'from-green-500 to-emerald-600'
                            },
                            {
                                title: 'Spectacles & Festivals',
                                description: 'Vivez les événements culturels locaux',
                                image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
                                color: 'from-red-500 to-rose-600'
                            }
                        ].map((activity, index) => (
                            <Link
                                key={index}
                                href="/experiences"
                                className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                            >
                                <Image
                                    src={activity.image}
                                    alt={activity.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-500"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-70 group-hover:opacity-80 transition`}></div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
                                    <p className="text-sm opacity-90">{activity.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Experiences */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            Expériences Récentes
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Découvrez nos dernières expériences disponibles
                        </p>
                    </div>

                    {featuredExperiences.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredExperiences.map((experience) => (
                                <Link
                                    key={experience.id}
                                    href={`/experiences/${experience.id}`}
                                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                                >
                                    <div className="relative h-64">
                                        <Image
                                            src={experience.images[0] || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800'}
                                            alt={experience.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {experience.city}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-amber-600">
                                                {experience.type === 'experience' ? 'Expérience' : 'Activité'}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{experience.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-amber-600 transition">
                                            {experience.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {experience.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-800">
                                                    {experience.price.toLocaleString('fr-FR')}
                                                </span>
                                                <span className="text-gray-500 ml-1">FCFA</span>
                                            </div>
                                            <span className="text-sm text-gray-500">{experience.duration}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Expériences à venir
                            </h3>
                            <p className="text-gray-600">
                                Nos expériences seront bientôt disponibles. Restez connectés !
                            </p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            href="/experiences"
                            className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg"
                        >
                            Voir toutes les expériences →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Avis Clients */}
            {reviews.length > 0 && (
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4 text-gray-800">
                                Ce que disent nos clients
                            </h2>
                            <p className="text-lg text-gray-600">
                                Des expériences authentiques racontées par nos visiteurs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-lg">
                                            {review.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-bold text-gray-800">{review.authorName}</h4>
                                            <p className="text-sm text-gray-500">{review.experienceTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < review.rating ? 'text-amber-500' : 'text-gray-300'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic">&quot;{review.comment}&quot;</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Partenaire officiel */}
            <section className="py-16 px-4 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 w-fit">
                                    Partenaire officiel
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                                    Ministère du Tourisme et de la Culture
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    KUUNI travaille en partenariat avec le Ministère du Tourisme et de la Culture
                                    du Burkina Faso pour promouvoir le patrimoine culturel et touristique du pays.
                                </p>
                                <Link
                                    href="/ministere"
                                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition w-fit"
                                >
                                    En savoir plus →
                                </Link>
                            </div>
                            <div className="relative h-64 md:h-auto">
                                <Image
                                    src="https://images.unsplash.com/photo-1569838438570-87eb3f259d58?w=800"
                                    alt="Ministère du Tourisme Burkina Faso"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Prêt à vivre une expérience inoubliable ?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Contactez-nous pour organiser votre découverte du Burkina Faso
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/experiences"
                            className="inline-block bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                        >
                            Réserver une expérience
                        </Link>
                        <Link
                            href="/a-propos"
                            className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
