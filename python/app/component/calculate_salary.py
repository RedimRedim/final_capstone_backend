import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.transform_data import calculate_working_rest_days
from utils.db_connection import MongoDbConnection
from component.employees import Employees
from component.timekeepingdb import TimekeepingDb
from dotenv import load_dotenv


dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class CalculateMonthlySalary:
    def __init__(
        self,
        employeesInstance: Employees,
        timekeepingDbInstance: TimekeepingDb,
        mongoDbConnectionInstance: MongoDbConnection,
    ) -> None:
        self.employees = employeesInstance
        self.timekeeping = timekeepingDbInstance
        self.mongoDbInstance = mongoDbConnectionInstance
        self.employeesDf = pd.DataFrame()  # Initialize as empty DataFrame
        self.timekeepingDf = pd.DataFrame()  # Initialize as empty DataFrame

    def merging_data(self):
        cutoff_date = pd.to_datetime("2024-07-01")

        self.employeesDf = self.employees.get_employees_data()
        self.timekeepingDf = self.timekeeping.get_timekeeping_data()

        self.employeesDf = self.employeesDf.merge(
            self.timekeepingDf, on="uuid", how="left"
        )

        self.employeesDf = self.employeesDf[
            (
                (self.employeesDf["isResign"] == True)
                & (self.employeesDf["resignDate"] >= cutoff_date)
            )
            | ((self.employeesDf["isResign"] == False))
        ]

        self.employeesDf["requiredWorkDays"] = self.employeesDf.apply(
            lambda row: calculate_working_rest_days(
                2024, 7, row["dayOff"], row["resignDate"]
            )[0],
            axis=1,  # workingDays
        )

        self.employeesDf["requiredRestDays"] = self.employeesDf.apply(
            lambda row: calculate_working_rest_days(
                2024, 7, row["dayOff"], row["resignDate"]
            )[1],
            axis=1,  # restDays
        )

        self.employeesDf["dailySalary"] = self.employeesDf.apply(
            lambda row: (row["basicSalary"] / 31), axis=1
        )

        self.employeesDf["baseSalary"] = self.employeesDf.apply(
            lambda row: (
                row["basicSalary"] / row["requiredWorkDays"] * row["resignDate"].day
                if pd.notnull(row["resignDate"]) and row["resignDate"] is not pd.NaT
                else row["dailySalary"] * (row["finishedWork"] + row["restDay"])
            ),
            axis=1,
        )

        self.employeesDf["lateDeduction"] = self.employeesDf.apply(
            lambda row: ((row["dailySalary"] / 8 / 60) * row["late"]), axis=1
        )

        self.employeesDf["absentDeduction"] = self.employeesDf.apply(
            lambda row: (row["dailySalary"] * row["absent"]), axis=1
        )

        self.employeesDf["totalReleasedSalary"] = self.employeesDf.apply(
            lambda row: (
                (row["baseSalary"] if pd.notnull(row["baseSalary"]) else 0)
                - (row["lateDeduction"] if pd.notnull(row["lateDeduction"]) else 0)
                - (row["absentDeduction"] if pd.notnull(row["absentDeduction"]) else 0)
            ),
            axis=1,
        )
        print("Uploading employees.csv")
        print(self.employeesDf)
        self.employeesDf.to_csv("./data/employees.csv")
        self.post_to_db()

    def post_to_db(self):
        self.collection = self.mongoDbInstance.get_collection(
            os.getenv("COLLECTION_SALARY_NAME")
        )

        self.collection.delete_many({})

        self.collection.insert_many(self.employeesDf.to_dict("records"))
        print("Salary has been uploaded to MongoDB")


# def main():
#     calculate_monthly_salary = CalculateMonthlySalary()
#     calculate_monthly_salary.merging_data()
