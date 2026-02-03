import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        // @ts-expect-error - Supabase type inference issue
        const { data, error } = await supabase
            .from('experiences')
            .insert({
                title: body.title,
                description: body.description,
                long_description: body.longDescription,
                city: body.city,
                type: body.type,
                category: body.category,
                group_name: body.group || null,
                price: body.price,
                duration: body.duration,
                images: body.images || [],
                highlights: body.highlights || [],
                included: body.included || [],
                not_included: body.notIncluded || [],
                featured: body.featured || false,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, experience: data }, { status: 201 });
    } catch (error) {
        console.error('Error creating experience:', error);
        return NextResponse.json({ success: false, error: 'Failed to create experience' }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        // @ts-expect-error - Supabase type inference issue with select
        const { data: experiences, error } = await supabase
            .from('experiences')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Transformer les données pour correspondre au format attendu
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedExperiences = experiences?.map((exp: any) => ({
            id: exp.id,
            title: exp.title,
            description: exp.description,
            longDescription: exp.long_description,
            city: exp.city,
            type: exp.type,
            category: exp.category,
            group: exp.group_name || undefined,
            price: exp.price,
            duration: exp.duration,
            images: exp.images || [],
            highlights: exp.highlights || [],
            included: exp.included || [],
            notIncluded: exp.not_included || [],
            createdAt: new Date(exp.created_at),
            featured: exp.featured,
        })) || [];

        return NextResponse.json({ experiences: transformedExperiences });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch experiences' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ success: false, error: 'Experience ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('experiences')
            .update({
                title: body.title,
                description: body.description,
                long_description: body.longDescription,
                city: body.city,
                type: body.type,
                category: body.category,
                group_name: body.group || null,
                price: body.price,
                duration: body.duration,
                images: body.images || [],
                highlights: body.highlights || [],
                included: body.included || [],
                not_included: body.notIncluded || [],
                featured: body.featured || false,
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, experience: data });
    } catch (error) {
        console.error('Error updating experience:', error);
        return NextResponse.json({ success: false, error: 'Failed to update experience' }, { status: 500 });
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
            return NextResponse.json({ success: false, error: 'Experience ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('experiences')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete experience' }, { status: 500 });
    }
}
