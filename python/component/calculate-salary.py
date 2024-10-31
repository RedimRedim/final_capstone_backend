from timekeepingdb import TimekeepingDb
from employees import Employees
import asyncio


class CalculateMonthlySalary:
    def __init__(self) -> None:
        self.employees = Employees()

    # we need to get data from employees
    # we also need to summarize from timekeeping to calculate

    async def calculate_monthy_salary_employees(self):
        await self.employees.get_employees()

    def calculate_required_Work_hours(self, row):
        if row["dayOff"] == "Sunday":
            print("Sunday")
        elif row["dayOff"] == "Saturday&Sunday":
            print("Saturday&Sunday")


calculateMonthlySalary = CalculateMonthlySalary()


async def main():
    await calculateMonthlySalary.calculate_monthy_salary_employees()


asyncio.run((main()))
