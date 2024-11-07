const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

class MongoDbManager {
  constructor() {
    this.client = null;
    this.collection = null;
    this.connected = false;
  }

  async connectDb(collection) {
    if (this.connected) return;

    try {
      this.client = new MongoClient(process.env.MONGODB_URLCLOUD, {
        serverSelectionTimeoutMS: 3000,
      });

      await this.client.connect();
      this.connected = true;
      console.log("Cloud DB has been connected");
    } catch (error) {
      console.log("Failed to connect Cloud MongoDB, trying local MongoDB");

      try {
        this.client = new MongoClient(process.env.MONGODB_URL); //LOCAL
        await this.client.connect();
        this.connected = true;
        console.log("Local DB has been connected");
      } catch (error) {
        console.log("Failed to connect Local MongoDB");
      }
    }

    const database = this.client.db(process.env.DB_NAME);
    this.collection = database.collection(collection);
  }

  async getCollection(collection) {
    try {
      if (this.collection) {
        return this.collection;
      } else {
        this.connectDb(collection);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  MongoDbManager,
};
