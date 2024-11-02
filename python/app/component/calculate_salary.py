import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from component.timekeepingdb import TimekeepingDb
from component.employees import Employees
from utils.transform_data import calculate_working_rest_days


class CalculateMonthlySalary:
    def __init__(self) -> None:
        self.employees = Employees()
        self.timekeeping = TimekeepingDb()
        self.employeesDf = None
        self.timekeepingDf = None

    def merging_data(self):
        cutoff_date = pd.to_datetime("2024-07-01")

        self.employeesDf = self.employees.get_employees_data()
        self.timekeepingDf = self.timekeeping.get_timekeeping_data()
        self.employeesDf = self.employeesDf.merge(
            self.timekeepingDf, on="uuid", how="left"
        )

        self.employeesDf["resignDate"] = pd.to_datetime(
            self.employeesDf["resignDate"], errors="coerce"
        )

        self.employeesDf = self.employeesDf[
            self.employeesDf["resignDate"].isna()
            | (
                self.employeesDf["isResign"]
                & (self.employeesDf["resignDate"] >= cutoff_date)
            )
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
            lambda row: (row["dailySalary"] * (row["finishedWork"] + row["restDay"])),
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
                row["baseSalary"] - row["lateDeduction"] - row["absentDeduction"]
            ),
            axis=1,
        )

        print("upload to employees.csv")
        self.employeesDf.to_csv("employees.csv")


def main():
    calculate_monthly_salary = CalculateMonthlySalary()
    calculate_monthly_salary.merging_data()


if __name__ == "__main__":
    main()
