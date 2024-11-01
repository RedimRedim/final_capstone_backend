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
        self.calculate_rest("2024-07-01", "2024-07-31")
        self.query_file()  # its joining with employee collection
        self.calculate_file()

        jsonData = self.convert_to_json(self.mainDf)
        return jsonData

    def read_file(self):
        if self.filePath.endswith(".xlsx"):
            self.mainDf = pd.read_excel(self.filePath)
            self.restDf = pd.read_excel(self.filePath, sheet_name="RD").dropna()

            # Drop rows where 'uuid' is None or empty
            self.mainDf = self.mainDf[
                self.mainDf["uuid"].notna() & (self.mainDf["uuid"] != "")
            ]
            print(self.mainDf)
            print(self.restDf)

    def calculate_file(self):

        # Calculate Employee Timekeeping
        self.mainDf["timeIn"] = pd.to_datetime(self.mainDf["timeIn"], errors="coerce")
        self.mainDf["timeOut"] = pd.to_datetime(self.mainDf["timeOut"], errors="coerce")
        self.mainDf["workingTime"] = pd.to_datetime(
            self.mainDf["workingTime"], errors="coerce"
        )

        self.mainDf["totalWorkHours"] = self.mainDf.apply(
            lambda row: (
                8 * 60
                if pd.isna(row["timeIn"])
                and pd.isna(row["timeOut"])
                and row["status"] != "RD"
                else (row["timeOut"] - row["timeIn"]).total_seconds() / 60
            ),
            axis=1,
        )

        self.mainDf["finishedWork"] = self.mainDf.apply(
            lambda row: (
                1
                if pd.notnull(row["totalWorkHours"]) and row["totalWorkHours"] > 320
                else 0
            ),
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
                1
                if (
                    pd.isna(row["timeIn"])
                    and pd.isna(row["timeOut"])
                    and row["status"] != "RD"
                    and pd.isna(row["totalWorkHours"])
                )
                or (row["totalWorkHours"] <= 320)
                else 0
            ),
            axis=1,
        )

    def calculate_rest(self, start, end):
        # TODOS
        # list out all monthly dates with employee RD and merging through monthly dates
        employeesDf = self.mainDf.drop_duplicates(subset=["uuid"], keep="first")
        employeesDf = employeesDf[["uuid", "name"]]

        dates = pd.date_range(start, end)
        datesDf = pd.DataFrame({"date": dates})
        employeesDf["key"] = 1
        datesDf["key"] = 1

        result = pd.merge(employeesDf, datesDf, on="key").drop("key", axis=1)
        restDf = self.restDf
        query = """SELECT result.uuid, result.name, DATE(result.date) as date, restDf.status FROM result LEFT JOIN restDf on restDf.date = result.date"""
        self.restDf = psql.sqldf(query, locals())

    def query_file(self):
        # merging all employees dates with timeIn timeOut
        restDf = self.restDf
        mainDf = self.mainDf

        query = """
            SELECT restDf.*, mainDf.workingTime, mainDf.timeIn, mainDf.timeOut
            FROM restDf
            LEFT JOIN mainDf
            on restDf.date = DATE(mainDf.workingTime)
            """
        self.mainDf = psql.sqldf(query, locals())

    # implementing SQL query to join and merging

    def convert_to_json(self, df):
        df["workingTime"] = pd.to_datetime(df["workingTime"], errors="coerce")
        df["timeIn"] = pd.to_datetime(df["timeIn"], errors="coerce")
        df["timeOut"] = pd.to_datetime(df["timeOut"], errors="coerce")

        df["workingTime"] = df["workingTime"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )
        df["timeIn"] = df["timeIn"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

        df["timeOut"] = df["timeOut"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

        df["totalWorkHours"] = df["totalWorkHours"].apply(
            lambda x: (int(x) if pd.notnull(x) and x != "" else None)
        )

        df["late"] = df["late"].apply(
            lambda x: (int(x) if pd.notnull(x) and x != "" else None)
        )

        data = df.to_json(orient="records")
        return json.loads(data)
