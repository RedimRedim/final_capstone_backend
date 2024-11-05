import os
from pymongo import MongoClient
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class MongoDbConnection:
    def __init__(self):
        self.db = None

    def connect_db(self):
        if not self.client:
            try:
                self.client = MongoClient(
                    os.getenv("MONGODB_URLCLOUD"), serverSelectionTimeoutMS=2000
                )
                self.client.admin.command("ping")
            except Exception as e:
                print(f"Failed to connect to cloud MongoDB: {e}")
                try:
                    print("Trying local")
                    self.client = MongoClient(
                        os.getenv("MONGODB_URL"), serverSelectionTimeoutMS=3000
                    )
                    self.client.admin.command("ping")
                except Exception as e:
                    print(f"failed to connect to local {e}")

            self.db = self.client[os.getenv("DB_NAME")]
            print("Database connected")
        else:
            print("Client already exists")

    def get_collection(self, collection):
        return self.db[collection]
