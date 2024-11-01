import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from component.timekeepingdb import TimekeepingDb
from component.employees import Employees
from utils.transform_data import calculate_working_rest_days
import asyncio
import pandasql as psql
import pandas as pd


class CalculateMonthlySalary:
    def __init__(self) -> None:
        self.employees = Employees()
        self.timekeeping = TimekeepingDb()
        self.employeesDf = None
        self.timekeepingDf = None

    async def merging_data(self):
        self.employeesDf = await self.employees.get_employees_data()
        self.timekeepingDf = await self.timekeeping.get_timekeeping_data()
        self.employeesDf = self.employeesDf.merge(
            self.timekeepingDf, on="uuid", how="left"
        )

        self.employeesDf["requiredWorkDays"] = self.employeesDf.apply(
            lambda row: calculate_working_rest_days(2024, 7, row["dayOff"])[0],
            axis=1,  # workingDays
        )

        self.employeesDf["requiredRestDays"] = self.employeesDf.apply(
            lambda row: calculate_working_rest_days(2024, 7, row["dayOff"])[1],
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

        self.employeesDf.to_csv("employees.csv")

    # we need to get data from employees
    # we also need to summarize from timekeeping to calculate

    # self.employeesDf["baseSalary"] = self.employeesDf.apply(
    #     lambda row: row[""] row["finishedWork"]
    # )
    # print(self.employeesDf)


async def main():
    calculateMonthlySalary = CalculateMonthlySalary()
    await calculateMonthlySalary.merging_data()


asyncio.run((main()))
