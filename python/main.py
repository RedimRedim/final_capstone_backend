from utils.filehandling import FileHandling
from utils.timekeepingdb import TimekeepingDb
import asyncio

timeKeeping = TimekeepingDb()
fileHandling = FileHandling(r"D:\Program Files\2024\final_capstone\test_salary.xlsx")


async def main():
    jsonData = fileHandling.init_file()
    await timeKeeping.write_db(jsonData)


if __name__ == "__main__":
    asyncio.run(main())
