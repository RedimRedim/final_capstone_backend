from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os

dotenv_path = os.path.join(os.path.dirname(__file__), "../../src/config/.env")
load_dotenv(dotenv_path)


class Employees:
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
            self.collection = db[os.getenv("COLLECTION_EMPLOYEES_NAME")]
            print("Database connected")
        else:
            print("Client already exists")
        return self.collection

    async def get_employees(self):
        print(f"col{self.collection}")
        if not self.collection:
            print("Connecting Employee db..")
            await self.connect_db()
        else:
            print("DB has been connected, no need to connect again.")

        employeeData = list(self.collection.find({}))
        employeeDf = pd.DataFrame(employeeData)
        return employeeDf
