import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BookingForm from '@/components/BookingForm';
import ReviewForm from '@/components/ReviewForm';

export const revalidate = 0;

async function getExperience(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: exp } = await (supabase as any)
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();

    if (!exp) return null;

    return {
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
    };
}

async function getReviews(experienceId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reviews } = await (supabase as any)
        .from('reviews')
        .select('*')
        .eq('experience_id', experienceId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return reviews?.map((review: any) => ({
        id: review.id,
        authorName: review.author_name,
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date(review.created_at),
    })) || [];
}

export async function generateStaticParams() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: experiences } = await (supabase as any)
        .from('experiences')
        .select('id');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return experiences?.map((exp: any) => ({
        id: exp.id,
    })) || [];
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const experience = await getExperience(id);
    const reviews = await getReviews(id);

    if (!experience) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-amber-600">Accueil</Link>
                        <span>›</span>
                        <Link href="/experiences" className="hover:text-amber-600">Expériences</Link>
                        <span>›</span>
                        <span className="text-gray-800 font-medium">{experience.title}</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {experience.city}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {experience.type === 'experience' ? 'Expérience' : 'Activité'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {experience.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        {experience.title}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {experience.description}
                    </p>
                </div>
            </div>

            {/* Images Gallery */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {experience.images.map((image, index) => (
                            <div key={index} className="relative h-96 rounded-lg overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`${experience.title} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <section className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">Description</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {experience.longDescription}
                            </p>
                        </section>

                        {/* Highlights */}
                        <section className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Points Forts</h2>
                            <ul className="space-y-3">
                                {experience.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-amber-600 font-bold text-xl">✓</span>
                                        <span className="text-gray-700 text-lg">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Included */}
                        <section className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">Ce qui est inclus</h2>
                            <ul className="space-y-3">
                                {experience.included.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-green-600 font-bold text-xl">✓</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Not Included */}
                        {experience.notIncluded.length > 0 && (
                            <section className="bg-white rounded-lg shadow-md p-8">
                                <h2 className="text-3xl font-bold mb-6 text-gray-800">Non inclus</h2>
                                <ul className="space-y-3">
                                    {experience.notIncluded.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-red-600 font-bold text-xl">✗</span>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Price Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <div className="text-center mb-6">
                                    <div className="text-sm text-gray-500 mb-2">À partir de</div>
                                    <div className="text-4xl font-bold text-gray-800">
                                        {experience.price.toLocaleString('fr-FR')}
                                        <span className="text-xl text-gray-500 ml-2">FCFA</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">par personne</div>
                                </div>

                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{experience.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{experience.city}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span>{experience.category}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <BookingForm
                                experienceId={experience.id}
                                experienceTitle={experience.title}
                                price={experience.price}
                            />

                            {/* Review Form */}
                            <div className="mt-6">
                                <ReviewForm
                                    experienceId={experience.id}
                                    experienceTitle={experience.title}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Avis */}
                {reviews.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 pb-12">
                        <section className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                                Avis des clients ({reviews.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review: { id: string; authorName: string; rating: number; comment: string; createdAt: Date }) => (
                                    <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                                                {review.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="font-semibold text-gray-800">{review.authorName}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {review.createdAt.toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'text-amber-500' : 'text-gray-300'}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
