import mongoose from "mongoose";

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

let global = { conn: null, promise: null };

// const MONGODB_URI = process.env.MONGODB_URL;
// process.env.MONGODB_URI ?? "";

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  async function connect() {
    try {
      cached.promise = await mongoose.connect(process.env.MONGODB_URL);
      console.log("connect..");
    } catch (err) {
      console.log("error..");
    }
  }
  if (!cached.promise) {
    connect();
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
