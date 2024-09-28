const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const url = process.env.MONGODB_URL;

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB server");
  } catch (error) {
    console.error("Failed to connect to MongoDB server", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB server closed");
  }
}

main().catch(console.error);
