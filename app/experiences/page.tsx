import Link from 'next/link';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { experiences as localExperiences } from '@/lib/data';

export const revalidate = 0;

async function getExperiences() {
    if (isSupabaseConfigured && supabase) {
        const { data: experiences } = await supabase
            .from('experiences')
            .select('*')
            .order('created_at', { ascending: false });

        return experiences?.map(exp => ({
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

    return localExperiences;
}

export default async function ExperiencesPage() {
    const experiences = await getExperiences();

    // Par ville
    const ouagadougouExperiences = experiences.filter(exp => exp.city === 'Ouagadougou');
    const boboDioulassoExperiences = experiences.filter(exp => exp.city === 'Bobo-Dioulasso');

    // Par catégorie
    const spaExperiences = experiences.filter(exp => exp.category.toLowerCase() === 'spa');
    const restaurantExperiences = experiences.filter(exp => exp.category.toLowerCase() === 'restaurant');
    const atelierExperiences = experiences.filter(exp => exp.category.toLowerCase() === 'atelier');

    const renderExperienceCard = (experience: typeof experiences[0]) => (
        <Link
            key={experience.id}
            href={`/experiences/${experience.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
        >
            <div className="relative h-64">
                <Image
                    src={experience.images[0] || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800'}
                    alt={experience.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    {experience.type === 'experience' ? 'Expérience' : 'Activité'}
                </div>
                <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {experience.city}
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-amber-600">{experience.category}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{experience.duration}</span>
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
                    <span className="text-amber-600 font-semibold group-hover:underline">
                        Voir les détails →
                    </span>
                </div>
            </div>
        </Link>
    );

    const renderSection = (
        title: string,
        subtitle: string,
        _icon: string,
        items: typeof experiences,
        bgClass: string = ''
    ) => {
        if (items.length === 0) return null;

        return (
            <section className={`py-16 px-4 ${bgClass}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            {title}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map(renderExperienceCard)}
                    </div>
                </div>
            </section>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-amber-600 to-amber-700">
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Nos Expériences
                    </h1>
                    <p className="text-xl">Découvrez Ouagadougou et Bobo-Dioulasso</p>
                </div>
            </section>

            {/* Navigation rapide */}
            <section className="py-8 px-4 bg-white border-b">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#spa" className="px-6 py-3 bg-pink-100 text-pink-700 rounded-full font-semibold hover:bg-pink-200 transition">
                            Spa & Bien-être
                        </a>
                        <a href="#restaurants" className="px-6 py-3 bg-orange-100 text-orange-700 rounded-full font-semibold hover:bg-orange-200 transition">
                            Restaurants
                        </a>
                        <a href="#ateliers" className="px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition">
                            Ateliers
                        </a>
                        <a href="#ouagadougou" className="px-6 py-3 bg-amber-100 text-amber-700 rounded-full font-semibold hover:bg-amber-200 transition">
                            Ouagadougou
                        </a>
                        <a href="#bobo" className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition">
                            Bobo-Dioulasso
                        </a>
                    </div>
                </div>
            </section>

            {/* Section Spa */}
            <div id="spa">
                {renderSection(
                    'Spa & Bien-être',
                    'Détendez-vous et prenez soin de vous dans nos meilleurs spas',
                    '',
                    spaExperiences,
                    'bg-pink-50'
                )}
            </div>

            {/* Section Restaurants */}
            <div id="restaurants">
                {renderSection(
                    'Restaurants',
                    'Découvrez la gastronomie burkinabè dans nos restaurants partenaires',
                    '',
                    restaurantExperiences,
                    'bg-orange-50'
                )}
            </div>

            {/* Section Ateliers */}
            <div id="ateliers">
                {renderSection(
                    'Ateliers',
                    'Apprenez et créez avec nos artisans locaux',
                    '',
                    atelierExperiences,
                    'bg-purple-50'
                )}
            </div>

            {/* Section Ouagadougou */}
            <div id="ouagadougou">
                {renderSection(
                    'Ouagadougou',
                    'La capitale politique et administrative, centre culturel du Burkina Faso',
                    '',
                    ouagadougouExperiences,
                    'bg-white'
                )}
            </div>

            {/* Section Bobo-Dioulasso */}
            <div id="bobo">
                {renderSection(
                    'Bobo-Dioulasso',
                    'La capitale économique, ville historique de l\'ouest burkinabè',
                    '',
                    boboDioulassoExperiences,
                    'bg-gray-50'
                )}
            </div>

        </div>
    );
}
