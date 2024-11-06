import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
import pandas as pd
from utils.db_connection import MongoDbConnection

dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class Employees:
    def __init__(self, mongoDbConnectionInstance: MongoDbConnection):
        self.client = None
        self.collection = None
        self.mongoDbInstance = mongoDbConnectionInstance

    def get_employees_data(self):
        print(os.getenv("COLLECTION_EMPLOYEES_NAME"))
        self.collection = self.mongoDbInstance.get_collection(
            os.getenv("COLLECTION_EMPLOYEES_NAME")
        )

        employeeData = list(self.collection.find({}))
        employeeDf = pd.DataFrame(employeeData)
        print(employeeDf.dtypes)
        return employeeDf


# if __name__ == "__main__":
#     employees = Employees()
#     employeesData = employees.get_employees_data()
#     print(employeesData)
