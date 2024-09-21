const  {MongoClient} = require('mongodb');

async function main() {
    const url = process.env.MONGODB_URL;

    const client = new MongoClient(url);
}