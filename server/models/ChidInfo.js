import mongoose from "mongoose";

const ChildInfoSchema = new mongoose.Schema(
  {
    childFirstName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    childLastName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bmi: Number,
    birthWeight: Number,
    vaccinationStatus: String,
    feedingStatus: {
      type: String,
      required: true,
    },
    healthConditions: String,
    dietryHabits: String,
    socioeconomicStatus: {
      type: String,
      required: true,
    },
    sanitizationFacs: {
      type: String,
      required: true,
    },
    waterSource: {
      type: String,
      required: true,
    },
    houseSize: Number,
    accessToHealthcare: {
      type: String,
      required: true,
    },
    dateOfDataCollection: {
      type: Date,
      required: true,
    },
    collectorName: {
      type: String,
      required: true,
    },
    collectionLocation: String,
    childImagePath: {
      type: String
    }
  },
  { timestamps: true }
);

const ChildInfo = mongoose.model("ChildInfo", ChildInfoSchema);
export default ChildInfo;
