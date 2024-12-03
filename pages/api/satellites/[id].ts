import connectToDatabase from "@/lib/db";
import Satellite from "@/models/Satellite";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await connectToDatabase();
  switch (req.method) {
    case "GET":
      try {
        // Find the satellite by its Norad id
        const satellite = await Satellite.findOne({ noradId: id});

        if (!satellite) {
          return res
            .status(404)
            .json({ message: `Satellite with id ${id} not found` });
        }

        // Return the found satellite
        res.status(200).json(satellite);
      } catch (error) {
        // Handle any errors during the fetch
        res.status(500).json({ message: "Error fetching satellite", error });
      }
      break;

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
}
