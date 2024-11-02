import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pandas as pd
import pandasql as psql
import json


class FileHandling:
    def __init__(self, filePath):
        self.filePath = filePath
        self.mainDf = None
        self.restDf = None

    def init_file(self):
        self.read_file()
        self.query_file()  # its joining with employee collection
        self.calculate_file()

        jsonData = self.convert_to_json()
        return jsonData

    def read_file(self):
        if self.filePath.endswith(".xlsx"):
            self.mainDf = pd.read_excel(self.filePath)
            self.restDf = pd.read_excel(self.filePath, sheet_name="RD").dropna()
            # Drop rows where 'uuid' is None or empty
            self.mainDf = self.mainDf[
                self.mainDf["uuid"].notna() & (self.mainDf["uuid"] != "")
            ]

    def calculate_file(self):

        # Calculate Employee Timekeeping
        self.mainDf["timeIn"] = pd.to_datetime(self.mainDf["timeIn"], errors="coerce")
        self.mainDf["timeOut"] = pd.to_datetime(self.mainDf["timeOut"], errors="coerce")
        self.mainDf["workingTime"] = pd.to_datetime(
            self.mainDf["workingTime"], errors="coerce"
        )

        self.mainDf["totalWorkHours"] = self.mainDf.apply(
            lambda row: (
                (row["timeOut"] - row["timeIn"]).total_seconds() / 60
                if pd.notnull(row["timeOut"]) & pd.notnull(row["timeIn"])
                else 0
            ),
            axis=1,
        )

        self.mainDf["finishedWork"] = self.mainDf.apply(
            lambda row: (1 if row["totalWorkHours"] > 320 else 0),
            axis=1,
        )

        self.mainDf["late"] = self.mainDf.apply(
            lambda row: (
                (row["timeIn"] - row["workingTime"]).total_seconds() / 60
                if pd.notnull(row["timeIn"])
                and pd.notnull(row["timeOut"])
                and row["timeIn"] > row["workingTime"]
                else 0
            ),
            axis=1,
        )

        self.mainDf["absent"] = self.mainDf.apply(
            lambda row: (
                0
                if row["status"] == "RD"
                else (
                    1
                    if (row["finishedWork"] == 0) or (row["totalWorkHours"] <= 320)
                    else 0
                )
            ),
            axis=1,
        )

        self.mainDf["workingTime"] = pd.to_datetime(
            self.mainDf["workingTime"], errors="coerce"
        )
        self.mainDf["timeIn"] = pd.to_datetime(self.mainDf["timeIn"], errors="coerce")
        self.mainDf["timeOut"] = pd.to_datetime(self.mainDf["timeOut"], errors="coerce")

        self.mainDf["workingTime"] = self.mainDf["workingTime"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )
        self.mainDf["timeIn"] = self.mainDf["timeIn"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

        self.mainDf["timeOut"] = self.mainDf["timeOut"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

        self.mainDf["totalWorkHours"] = self.mainDf["totalWorkHours"].apply(
            lambda x: (int(x) if pd.notnull(x) and x != "" else None)
        )

        self.mainDf["late"] = self.mainDf["late"].apply(
            lambda x: (int(x) if pd.notnull(x) and x != "" else None)
        )

        self.mainDf.to_csv("timekeeping.csv")

    def query_file(self):
        # merging all employees dates with timeIn timeOut
        restDf = self.restDf
        mainDf = self.mainDf

        query = """
            SELECT mainDf.*,
            restDf.status 
            FROM mainDf
            LEFT JOIN restDf
            on DATE(restDf.date) = DATE(mainDf.workingTime) and restDf.uuid = mainDf.uuid
            """
        self.mainDf = psql.sqldf(query, locals())

    # implementing SQL query to join and merging

    def convert_to_json(self):
        data = self.mainDf.to_json(orient="records")

        return json.loads(data)
