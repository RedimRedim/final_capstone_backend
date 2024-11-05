from component.employees import Employees
from component.filehandling import FileHandling
from component.calculate_salary import CalculateMonthlySalary
from component.timekeepingdb import TimekeepingDb
from utils.db_connection import MongoDbConnection

mongoDbConnectionInstance = MongoDbConnection()
print("MongoDbConnection instance created:", mongoDbConnectionInstance)

employeesInstance = Employees(mongoDbConnectionInstance)
print("Employees instance created with MongoDbConnection:", employeesInstance)

fileHandlingInstance = FileHandling(employeesInstance)
timekeepingDbInstance = TimekeepingDb(mongoDbConnectionInstance)
calculateMonthlySalaryInstance = CalculateMonthlySalary(
    employeesInstance, timekeepingDbInstance, mongoDbConnectionInstance
)
