from component.filehandling import FileHandling
from component.timekeepingdb import TimekeepingDb
from component.calculate_salary import CalculateMonthlySalary
import asyncio
import os

path = os.path.join(os.path.dirname(__file__), "../app/data/test_salary.xlsx")
print(path)
timeKeeping = TimekeepingDb()
fileHandling = FileHandling(path)
calculateMonthlySalary = CalculateMonthlySalary()


def main():
    jsonData = fileHandling.init_file()
    timeKeeping.write_db(jsonData)
    calculateMonthlySalary.merging_data()


# running timekeeping data
if __name__ == "__main__":
    main()
