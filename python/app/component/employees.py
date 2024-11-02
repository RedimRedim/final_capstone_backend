import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
from utils.db_connection import MongoDbConnection
import pandas as pd

dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class Employees(MongoDbConnection):
    def __init__(self):
        super().__init__()  # Properly initialize the parent class
        self.client = None
        self.collection = None

    def get_employees_data(self):
        self.collection = self.get_collection(os.getenv("COLLECTION_EMPLOYEES_NAME"))

        employeeData = list(self.collection.find({}))
        employeeDf = pd.DataFrame(employeeData)
        return employeeDf


# if __name__ == "__main__":
#     employees = Employees()
#     employeesData = employees.get_employees_data()
#     print(employeesData)
