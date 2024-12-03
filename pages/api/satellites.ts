import connectToDatabase from "@/lib/db";
import Satellite from "@/models/Satellite";
import { saveSatelliteData, startScheduler } from "@/utils/scheduler";
import { NextApiRequest, NextApiResponse } from "next";
let isInitialized = false;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isInitialized) {
    console.log("Running scheduler on app startup...");
    await saveSatelliteData();
    await startScheduler();
    isInitialized = true; // Prevent multiple executions
  }
  
  await connectToDatabase();
  switch (req.method) {
    case "GET":
      try {
        // Fetch all satellites from MongoDB
        const satellites = await Satellite.find();

        // Return the list of satellites
        res.status(200).json(satellites);
      } catch (error) {
        // Handle any errors during the fetch
        res.status(500).json({ message: "Error fetching satellites", error });
      }
      break;

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
