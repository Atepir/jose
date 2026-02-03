'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Experience } from '@/types';

const GROUPS = [
    { id: 'spa', name: 'Spa & Bien-être', color: 'pink' },
    { id: 'restaurant', name: 'Restaurants', color: 'orange' },
    { id: 'culture', name: 'Culture & Patrimoine', color: 'amber' },
    { id: 'atelier', name: 'Ateliers', color: 'purple' },
    { id: 'nature', name: 'Nature & Aventure', color: 'green' },
    { id: 'autre', name: 'Autres', color: 'gray' },
];

export default function AdminExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Experience>>({
        title: '',
        description: '',
        longDescription: '',
        city: 'Ouagadougou',
        type: 'experience',
        category: '',
        group: '',
        price: 0,
        duration: '',
        images: [''],
        highlights: [''],
        included: [''],
        notIncluded: [''],
        featured: false,
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await fetch('/api/experiences');
            const data = await response.json();
            setExperiences(data.experiences);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingExperience ? 'PUT' : 'POST';
            const body = {
                ...formData,
                id: editingExperience?.id,
                images: formData.images?.filter(img => img.trim() !== ''),
                highlights: formData.highlights?.filter(h => h.trim() !== ''),
                included: formData.included?.filter(i => i.trim() !== ''),
                notIncluded: formData.notIncluded?.filter(n => n.trim() !== ''),
            };

            const response = await fetch('/api/experiences', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                alert(editingExperience ? 'Expérience modifiée avec succès !' : 'Expérience ajoutée avec succès !');
                setShowForm(false);
                setEditingExperience(null);
                fetchExperiences();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving experience:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience);
        setFormData({
            title: experience.title,
            description: experience.description,
            longDescription: experience.longDescription,
            city: experience.city,
            type: experience.type,
            category: experience.category,
            group: experience.group || '',
            price: experience.price,
            duration: experience.duration,
            images: experience.images.length > 0 ? experience.images : [''],
            highlights: experience.highlights.length > 0 ? experience.highlights : [''],
            included: experience.included.length > 0 ? experience.included : [''],
            notIncluded: experience.notIncluded.length > 0 ? experience.notIncluded : [''],
            featured: experience.featured,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/experiences?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Expérience supprimée avec succès !');
                fetchExperiences();
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
            alert('Une erreur est survenue lors de la suppression.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            longDescription: '',
            city: 'Ouagadougou',
            type: 'experience',
            category: '',
            group: '',
            price: 0,
            duration: '',
            images: [''],
            highlights: [''],
            included: [''],
            notIncluded: [''],
            featured: false,
        });
        setEditingExperience(null);
    };

    const updateArrayField = (field: 'images' | 'highlights' | 'included' | 'notIncluded', index: number, value: string) => {
        const array = [...(formData[field] || [''])];
        array[index] = value;
        setFormData({ ...formData, [field]: array });
    };

    const addArrayField = (field: 'images' | 'highlights' | 'included' | 'notIncluded') => {
        setFormData({ ...formData, [field]: [...(formData[field] || ['']), ''] });
    };

    const removeArrayField = (field: 'images' | 'highlights' | 'included' | 'notIncluded', index: number) => {
        const array = [...(formData[field] || [''])];
        array.splice(index, 1);
        setFormData({ ...formData, [field]: array.length > 0 ? array : [''] });
    };

    // Grouper les expériences
    const getExperiencesByGroup = (groupId: string) => {
        return experiences.filter(exp => {
            const expGroup = exp.group?.toLowerCase() || '';
            const expCategory = exp.category?.toLowerCase() || '';

            if (groupId === 'spa') {
                return expGroup === 'spa' || expCategory.includes('spa') || expCategory.includes('bien-être');
            }
            if (groupId === 'restaurant') {
                return expGroup === 'restaurant' || expCategory.includes('restaurant') || expCategory.includes('gastronomie');
            }
            if (groupId === 'culture') {
                return expGroup === 'culture' || expCategory.includes('culture') || expCategory.includes('patrimoine');
            }
            if (groupId === 'atelier') {
                return expGroup === 'atelier' || expCategory.includes('atelier');
            }
            if (groupId === 'nature') {
                return expGroup === 'nature' || expCategory.includes('nature') || expCategory.includes('aventure');
            }
            if (groupId === 'autre') {
                // Expériences sans groupe défini
                const otherGroups = ['spa', 'restaurant', 'culture', 'atelier', 'nature'];
                return !otherGroups.some(g =>
                    expGroup.includes(g) || expCategory.includes(g)
                );
            }
            return false;
        });
    };

    const filteredExperiences = activeGroup
        ? getExperiencesByGroup(activeGroup)
        : experiences;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des expériences...</p>
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
                        <h1 className="text-4xl font-bold text-gray-800">
                            Gérer les Expériences
                        </h1>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                if (showForm) {
                                    resetForm();
                                }
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            {showForm ? 'Annuler' : '+ Ajouter une expérience'}
                        </button>
                    </div>
                </div>

                {/* Filtres par groupe */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtrer par groupe</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveGroup(null)}
                            className={`px-4 py-2 rounded-full font-semibold transition ${activeGroup === null
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tout ({experiences.length})
                        </button>
                        {GROUPS.map(group => {
                            const count = getExperiencesByGroup(group.id).length;
                            return (
                                <button
                                    key={group.id}
                                    onClick={() => setActiveGroup(group.id)}
                                    className={`px-4 py-2 rounded-full font-semibold transition ${activeGroup === group.id
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {group.name} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Add/Edit Experience Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {editingExperience ? 'Modifier l\'Expérience' : 'Nouvelle Expérience'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Titre *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catégorie *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Culture, Restaurant, Atelier..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Groupe
                                    </label>
                                    <select
                                        value={formData.group}
                                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="">-- Sélectionner un groupe --</option>
                                        {GROUPS.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ville *
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value as 'Ouagadougou' | 'Bobo-Dioulasso' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="Ouagadougou">Ouagadougou</option>
                                        <option value="Bobo-Dioulasso">Bobo-Dioulasso</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'experience' | 'activity' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="experience">Expérience</option>
                                        <option value="activity">Activité</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prix (FCFA) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Durée *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="2 heures, 1 journée..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description courte *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description longue *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URLs des images
                                </label>
                                {formData.images?.map((image, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="url"
                                            value={image}
                                            onChange={(e) => updateArrayField('images', index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('images', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField('images')}
                                    className="text-amber-600 hover:text-amber-700 font-semibold"
                                >
                                    + Ajouter une image
                                </button>
                            </div>

                            {/* Highlights */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Points forts
                                </label>
                                {formData.highlights?.map((highlight, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('highlights', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField('highlights')}
                                    className="text-amber-600 hover:text-amber-700 font-semibold"
                                >
                                    + Ajouter un point fort
                                </button>
                            </div>

                            {/* Included */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inclus
                                </label>
                                {formData.included?.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateArrayField('included', index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('included', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField('included')}
                                    className="text-amber-600 hover:text-amber-700 font-semibold"
                                >
                                    + Ajouter un élément inclus
                                </button>
                            </div>

                            {/* Not Included */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Non inclus
                                </label>
                                {formData.notIncluded?.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => updateArrayField('notIncluded', index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayField('notIncluded', index)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayField('notIncluded')}
                                    className="text-amber-600 hover:text-amber-700 font-semibold"
                                >
                                    + Ajouter un élément non inclus
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                    Mettre en avant sur la page d&apos;accueil
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                                >
                                    {editingExperience ? 'Enregistrer les modifications' : 'Ajouter l\'expérience'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Experiences List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {activeGroup
                            ? `${GROUPS.find(g => g.id === activeGroup)?.name} (${filteredExperiences.length})`
                            : `Toutes les expériences (${experiences.length})`
                        }
                    </h2>
                    {filteredExperiences.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Aucune expérience
                            </h3>
                            <p className="text-gray-600">
                                {activeGroup
                                    ? 'Aucune expérience dans ce groupe.'
                                    : 'Commencez par ajouter votre première expérience.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExperiences.map((exp) => (
                                <div key={exp.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                                    <div className="relative h-48">
                                        {exp.images.length > 0 ? (
                                            <Image
                                                src={exp.images[0]}
                                                alt={exp.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">Pas d&apos;image</span>
                                            </div>
                                        )}
                                        {exp.featured && (
                                            <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                                En vedette
                                            </div>
                                        )}
                                        {exp.group && (
                                            <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold">
                                                {GROUPS.find(g => g.id === exp.group)?.name || exp.group}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {exp.city}
                                            </span>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                                {exp.type === 'experience' ? 'Expérience' : 'Activité'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                                            {exp.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {exp.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-amber-600">
                                                {exp.price.toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                                            >
                                                Supprimer
                                            </button>
                                            <Link
                                                href={`/experiences/${exp.id}`}
                                                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                                            >
                                                Voir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
