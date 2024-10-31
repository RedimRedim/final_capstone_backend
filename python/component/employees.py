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
        print("Inside connect_db()")
        if not self.client:
            self.client = MongoClient(os.getenv("MONGODB_URLCLOUD"))
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
        print(employeeDf)
        return employeeDf
