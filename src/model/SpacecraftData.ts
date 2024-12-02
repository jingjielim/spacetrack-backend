import mongoose, { Document, Schema } from "mongoose";

export interface ISpacecraftData extends Document {
  noradId: string;
  tleLine1: string;
  tleLine2: string;
  epoch: Date;
  name: string;
}

const SpacecraftDataSchema: Schema = new Schema(
  {
    noradId: { type: String, required: true, unique: true },
    tleLine1: { type: String, required: true },
    tleLine2: { type: String, required: true },
    epoch: { type: Date, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const SpacecraftData =
  mongoose.models.SpacecraftData ||
  mongoose.model<ISpacecraftData>("SpacecraftData", SpacecraftDataSchema);

export default SpacecraftData;
