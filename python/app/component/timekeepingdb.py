import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from dotenv import load_dotenv
import pandas as pd
import pandasql as psql
from utils.db_connection import MongoDbConnection

dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class TimekeepingDb:
    def __init__(self, mongoDbConnectionInstance: MongoDbConnection):
        self.client = None
        self.collection = None
        self.mongoDbInstance = mongoDbConnectionInstance

    def write_db(self, jsonData):
        self.collection = self.mongoDbInstance.get_collection(
            os.getenv("COLLECTION_TIMEKEEPING_NAME")
        )

        # clear all timekeeping 1st
        self.collection.delete_many({})
        print("Deleted timekeeping data")
        # insert
        self.collection.insert_many(jsonData)
        print("Timekeeping data has been added")

    def get_timekeeping_data(self):
        self.collection = self.mongoDbInstance.get_collection(
            os.getenv("COLLECTION_TIMEKEEPING_NAME")
        )
        timekeepingData = list(self.collection.find({}))
        timekeepingDf = pd.DataFrame(timekeepingData)
        timekeepingDf["_id"] = timekeepingDf["_id"].astype(str)
        query = """SELECT uuid,name, COUNT(case when status like "%RD%" then 1 end) as restDay, sum(finishedwork) as finishedWork, sum(late) as late , sum(absent) as absent
        FROM timekeepingDf GROUP BY uuid"""

        timekeepingDf = psql.sqldf(query, locals())

        return timekeepingDf


# if __name__ == "__main__":
#     timekeepingDb = TimekeepingDb()
#     timekeepingData = timekeepingDb.get_timekeeping_data()
#     print(timekeepingData)
