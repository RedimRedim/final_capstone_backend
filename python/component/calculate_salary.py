import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from component.timekeepingdb import TimekeepingDb
from component.employees import Employees
from utils.transform_data import calculate_working_days
import asyncio


class CalculateMonthlySalary:
    def __init__(self) -> None:
        self.employees = Employees()
        self.timekeeping = TimekeepingDb()
        self.employeesDf = None

    # we need to get data from employees
    # we also need to summarize from timekeeping to calculate

    async def calculate_monthly_salary_employees(self):
        self.employeesDf = await self.employees.get_employees()
        self.employeesDf["requiredWorkHours"] = self.employeesDf.apply(
            lambda row: calculate_working_days(2024, 7, row["dayOff"]), axis=1
        )
        print(self.employeesDf)


async def main():
    calculateMonthlySalary = CalculateMonthlySalary()
    await calculateMonthlySalary.calculate_monthly_salary_employees()


asyncio.run((main()))
