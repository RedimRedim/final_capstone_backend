from component.filehandling import FileHandling
from component.timekeepingdb import TimekeepingDb
import asyncio
import os

path = os.path.join(os.path.dirname(__file__), "../test_salary.xlsx")
timeKeeping = TimekeepingDb()
fileHandling = FileHandling(path)


async def main():
    jsonData = fileHandling.init_file()
    await timeKeeping.write_db(jsonData)


# running timekeeping data
if __name__ == "__main__":
    asyncio.run(main())
