const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

class MongoDb {
  constructor() {
    this.db = this.connectDb();
  }

  async connectDb() {
    try {
      const url = process.env.MONGODB_URL;
      const client = new MongoClient(url);
      await client.connect();
      const database = client.db(process.env.DB_NAME);

      console.log("Connected to MongoDB server");
      return database;
    } catch (error) {
      console.error("Failed to connect to MongoDB server", error);
    }
  }

  async getAllEmployees() {
    return await this.db;
  }
}

const MongoDbClient = new MongoDb();
await new Promise((resolve) => setTimeout(resolve, 1000));

console.log(MongoDbClient.getAllEmployees());
