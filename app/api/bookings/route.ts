import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        const body = await request.json();

        const { data, error } = await supabase
            .from('booking_requests')
            .insert({
                experience_id: body.experienceId,
                experience_title: body.experienceTitle,
                name: body.name,
                email: body.email,
                phone: body.phone,
                number_of_people: body.numberOfPeople,
                preferred_date: body.preferredDate,
                message: body.message || '',
                status: 'pending' as const,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, booking: data }, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (!isSupabaseConfigured) {
            return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
        }

        // @ts-expect-error - Supabase type inference issue
        const { data: bookings, error } = await supabase
            .from('booking_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // Transformer les données pour correspondre au format attendu
        const transformedBookings = bookings?.map(booking => ({
            id: booking.id,
            experienceId: booking.experience_id,
            experienceTitle: booking.experience_title,
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            numberOfPeople: booking.number_of_people,
            preferredDate: booking.preferred_date,
            message: booking.message,
            createdAt: new Date(booking.created_at),
            status: booking.status,
        })) || [];

        return NextResponse.json({ bookings: transformedBookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
