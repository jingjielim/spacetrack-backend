import connectToDatabase from "@/lib/db";
import { getSatelliteData } from "@/lib/satellite";
import Satellite from "@/models/Satellite";
import cron from "node-cron";

export async function saveSatelliteData() {
  try {
    await connectToDatabase();
    const satelliteData = await getSatelliteData();
    if (!satelliteData.length) {
      console.log("No data");
      return;
    }
    console.log("Saving data...");

    const bulkOps = satelliteData.map((satellite) => ({
      updateOne: {
        filter: { noradId: satellite.noradId },
        update: { $set: satellite },
        upsert: true,
      },
    }));
    await Satellite.bulkWrite(bulkOps);
  } catch (error) {
    throw Error("Error saving satellite data", error as Error);
  }
}

export function startScheduler() {
  cron.schedule("0 23 * * *", () => {
    console.log("Running the task at 7 AM Singapore Time (SGT)");
    saveSatelliteData();
  });
}
