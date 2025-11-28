import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event } from '@/database';

// Define the type for route parameters
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params to get the slug value
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Trim and validate slug format (URL-friendly check)
    const trimmedSlug = slug.trim();
    if (trimmedSlug.length === 0) {
      return NextResponse.json(
        { error: 'Slug cannot be empty' },
        { status: 400 }
      );
    }

    // Basic slug format validation (alphanumeric and hyphens only)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(trimmedSlug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Query the database for the event by slug
    const event = await Event.findOne({ slug: trimmedSlug }).lean();

    // Handle case where event is not found
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return the event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log the error for debugging (in production, use a proper logging service)
    console.error('Error fetching event by slug:', error);

    // Return a generic error response
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while fetching the event',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
