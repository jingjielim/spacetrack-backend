import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Satellite from '@/models/Satellite';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Find the satellite by its Norad ID
    const satellite = await Satellite.findOne({ noradId: id });

    if (!satellite) {
      return NextResponse.json(
        { message: `Satellite with id ${id} not found` },
        { status: 404 }
      );
    }

    // Return the found satellite
    return NextResponse.json(satellite);
  } catch (error) {
    console.error("Error fetching satellite:", error);
    return NextResponse.json(
      { message: "Error fetching satellite", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
