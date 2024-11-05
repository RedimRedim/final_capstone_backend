from component.employees import Employees
from component.filehandling import FileHandling
from component.calculate_salary import CalculateMonthlySalary
from component.timekeepingdb import TimekeepingDb
from utils.db_connection import MongoDbConnection

mongoDbConnectionInstance = MongoDbConnection()

employeesInstance = Employees(mongoDbConnectionInstance)
fileHandlingInstance = FileHandling(employeesInstance)
timekeepingDbInstance = TimekeepingDb(mongoDbConnectionInstance)
calculateMonthlySalaryInstance = CalculateMonthlySalary(
    employeesInstance, timekeepingDbInstance, mongoDbConnectionInstance
)
