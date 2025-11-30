'use server';

import Booking from '@/database/booking.model';

import connectDB from "@/lib/mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    console.log('Creating booking for:', { eventId, slug, email });
    try {
        await connectDB();
        console.log('Database connected');

        await Booking.create({ eventId, slug, email });
        console.log('Booking created successfully');

        return { success: true};
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}