import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
const urlModel = mongoose.model("ShortUrls", urlSchema);

export const connectToDatabase = async () =>
  await mongoose.connect(`${process.env.MONGO_URI}`);

export { urlModel };
