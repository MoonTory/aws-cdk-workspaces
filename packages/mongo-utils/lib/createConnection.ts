import * as mongoose from "mongoose";

export type MongoConnectionOrNull = typeof mongoose | null;

export const createConnection = async (uri: string, conn: MongoConnectionOrNull) => {
  if (conn) {
    console.warn("MongoDB already connected...");
    return conn;
  }

  try {
    mongoose.connection.once("open", () => {
      console.log("MongoDB Connected...");
    });

    conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    return conn;
  } catch (error) {
    console.info("Error connecting to MongoDb => ", error);
    return null;
  }
};
