import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};
