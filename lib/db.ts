import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("DB is already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("DB is connecting");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next-mongodb-restapis",
      bufferCommands: true,
    });
    console.log("DB connected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Error: ", error);
    throw new Error("Error: ", error);
  }
};

export default connect;
