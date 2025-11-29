'use server';

import Event  from "@/database/event.model";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug= async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });
         if (!event) return [];

        // Find events that share at least one tag with the current event, excluding the event itself
        // _id: { $ne: event._id } $ne = "not equal"
        // tags: { $in: event.tags } $in = "in array"
        return await Event.find({
        _id: { $ne: event._id },
        tags: { $in: event.tags },
        }).lean();
        } catch (error) {
        console.error('Error fetching similar events:', error);
        throw error;
    }}