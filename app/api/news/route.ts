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
            .from('news')
            .insert({
                title: body.title,
                excerpt: body.excerpt,
                content: body.content,
                image_url: body.imageUrl || null,
                category: body.category,
                published_at: body.publishedAt || new Date().toISOString(),
                published: body.published || false,
                featured: body.featured || false,
                author: body.author || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, article: data }, { status: 201 });
    } catch (error) {
        console.error('Error creating news article:', error);
        return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all'); // Pour l'admin, récupérer tous les articles
        const category = searchParams.get('category');
        const published = searchParams.get('published');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase as any)
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        // Filtrer par statut de publication
        if (published === 'true') {
            query = query.eq('published', true);
        } else if (!all) {
            query = query.eq('published', true);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data: articles, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedArticles = articles?.map((article: any) => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            imageUrl: article.image_url,
            category: article.category,
            publishedAt: article.published_at,
            createdAt: article.created_at,
            published: article.published,
            featured: article.featured || false,
            author: article.author,
        })) || [];

        return NextResponse.json(transformedArticles);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('news')
            .update({
                title: body.title,
                excerpt: body.excerpt,
                content: body.content,
                image_url: body.imageUrl || null,
                category: body.category,
                published_at: body.publishedAt,
                published: body.published,
                featured: body.featured || false,
                author: body.author || null,
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, article: data });
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
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
            return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('news')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
    }
}
