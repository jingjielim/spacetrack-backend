import mongoose, { Document, Schema } from "mongoose";

export interface ISatellite extends Document {
  noradId: string;
  tleLine1: string;
  tleLine2: string;
  epoch: Date;
  name: string;
  lastUpdated: Date;
}

const SatelliteSchema: Schema = new Schema(
  {
    noradId: { type: String, required: true, unique: true },
    tleLine1: { type: String, required: true },
    tleLine2: { type: String, required: true },
    epoch: { type: Date, required: true },
    name: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
  },
  { timestamps: true }
);

const Satellite =
  mongoose.models.Satellite ||
  mongoose.model<ISatellite>("Satellite", SatelliteSchema);

export default Satellite;
