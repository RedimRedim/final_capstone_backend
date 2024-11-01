from pymongo import MongoClient
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), "../../src/config/.env")
load_dotenv(dotenv_path)


class TimekeepingDb:
    def __init__(self):
        self.client = None
        self.collection = None

    async def connect_db(self):
        if not self.client:
            try:
                self.client = MongoClient(
                    os.getenv("MONGODB_URLCLOUD"), serverSelectionTimeoutMS=3000
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

            db = self.client[os.getenv("DB_NAME")]
            self.collection = db[os.getenv("COLLECTION_TIMEKEEPING_NAME")]
            print("Database connected")
        else:
            print("Client already exists")
        return self.collection

    async def write_db(self, jsonData):
        if not self.collection:
            print("Connecting db..")
            await self.connect_db()
        else:
            print("DB has been connected, no need to connect again.")

        # clear all timekeeping 1st
        self.collection.delete_many({})
        print("Deleted timekeeping data")
        # insert
        self.collection.insert_many(jsonData)
        print("Timekeeping data has been added")

    # def reset_json_datatype(self,jsonData):


# async def main():
#     timekeeping = TimekeepingDb()
