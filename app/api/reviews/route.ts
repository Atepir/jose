import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('reviews')
            .insert({
                experience_id: body.experienceId,
                experience_title: body.experienceTitle,
                author_name: body.authorName,
                author_email: body.authorEmail,
                rating: body.rating,
                comment: body.comment,
                approved: false, // Les avis doivent être approuvés
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, review: data }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const experienceId = searchParams.get('experienceId');
        const all = searchParams.get('all'); // Pour l'admin, récupérer tous les avis

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase as any)
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (experienceId) {
            query = query.eq('experience_id', experienceId);
        }

        // Par défaut, ne retourner que les avis approuvés (sauf pour l'admin)
        if (!all) {
            query = query.eq('approved', true);
        }

        const { data: reviews, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedReviews = reviews?.map((review: any) => ({
            id: review.id,
            experienceId: review.experience_id,
            experienceTitle: review.experience_title,
            authorName: review.author_name,
            authorEmail: review.author_email,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(review.created_at),
            approved: review.approved,
        })) || [];

        return NextResponse.json({ reviews: transformedReviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('reviews')
            .update({
                approved: body.approved,
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, review: data });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('reviews')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
    }
}
