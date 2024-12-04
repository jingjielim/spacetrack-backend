import connectToDatabase from "@/lib/db";
import Satellite from "@/models/Satellite";
import { saveSatelliteData, startScheduler } from "@/utils/scheduler";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
let isInitialized = false;

export async function GET() {
  try {
    if (!isInitialized) {
      console.log("Running scheduler on app startup...");
      await saveSatelliteData();
      await startScheduler();
      isInitialized = true; // Prevent multiple executions
    }

    await connectToDatabase();
    const satellites = await Satellite.find();
    return NextResponse.json({ data: satellites });
  } catch (error) {
    console.error("Error fetching satellites:", error);
    return NextResponse.json(
      { message: "Error fetching satellites", error },
      { status: 500 }
    );
  }
}
