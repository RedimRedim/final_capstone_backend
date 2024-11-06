import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from dotenv import load_dotenv
import pandas as pd
import pandasql as psql
import json
from component.employees import Employees

dotenv_path = os.path.join(os.path.dirname(__file__), "../config/.env")
load_dotenv(dotenv_path)


class FileHandling:
    def __init__(self, employeesInstance: Employees):
        self.filePath = None
        self.timekeepingDf = None
        self.restDf = None
        self.employees = employeesInstance

    def init_file(self, file):
        self.filePath = file
        self.read_file()
        self.query_file()  # its joining with employee collection
        self.calculate_file()

        jsonData = self.convert_to_json()
        return jsonData

    def read_file(self):
        if self.filePath.filename.lower().endswith(".xlsx"):
            self.timekeepingDf = self.timekeeping_with_absent_data()
            self.restDf = pd.read_excel(self.filePath, sheet_name="RD").dropna()
            # Drop rows where 'uuid' is None or empty
            self.timekeepingDf = self.timekeepingDf[
                self.timekeepingDf["uuid"].notna() & (self.timekeepingDf["uuid"] != "")
            ]

    def timekeeping_with_absent_data(self):
        self.timekeepingDf = pd.read_excel(self.filePath)
        employeeData = self.employees.get_employees_data()[
            ["uuid", "isResign", "resignDate"]
        ]
        self.timekeepingDf = self.timekeepingDf.merge(
            employeeData, on="uuid", how="left"
        )

        return self.timekeepingDf

    def formatting_variable(self):
        self.timekeepingDf["workingTime"] = pd.to_datetime(
            self.timekeepingDf["workingTime"], errors="coerce"
        )
        self.timekeepingDf["timeIn"] = pd.to_datetime(
            self.timekeepingDf["timeIn"], errors="coerce"
        )
        self.timekeepingDf["timeOut"] = pd.to_datetime(
            self.timekeepingDf["timeOut"], errors="coerce"
        )

        self.timekeepingDf["resignDate"] = pd.to_datetime(
            self.timekeepingDf["resignDate"], errors="coerce"
        ).dt.date

        self.timekeepingDf["workingTime"] = self.timekeepingDf["workingTime"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )
        self.timekeepingDf["timeIn"] = self.timekeepingDf["timeIn"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

        self.timekeepingDf["timeOut"] = self.timekeepingDf["timeOut"].apply(
            lambda x: x.isoformat() if pd.notnull(x) else None
        )

    def calculate_file(self):
        self.formatting_variable()
        # Calculate Employee Timekeeping
        self.timekeepingDf["timeIn"] = pd.to_datetime(
            self.timekeepingDf["timeIn"], errors="coerce"
        )
        self.timekeepingDf["timeOut"] = pd.to_datetime(
            self.timekeepingDf["timeOut"], errors="coerce"
        )
        self.timekeepingDf["workingTime"] = pd.to_datetime(
            self.timekeepingDf["workingTime"], errors="coerce"
        )

        self.timekeepingDf["totalWorkHours"] = self.timekeepingDf.apply(
            lambda row: (
                (row["timeOut"] - row["timeIn"]).total_seconds() / 60
                if pd.notnull(row["timeOut"]) & pd.notnull(row["timeIn"])
                else 0
            ),
            axis=1,
        )

        self.timekeepingDf["finishedWork"] = self.timekeepingDf.apply(
            lambda row: (1 if row["totalWorkHours"] > 320 else 0),
            axis=1,
        )

        self.timekeepingDf["late"] = self.timekeepingDf.apply(
            lambda row: (
                (row["timeIn"] - row["workingTime"]).total_seconds() / 60
                if pd.notnull(row["timeIn"])
                and pd.notnull(row["timeOut"])
                and row["timeIn"] > row["workingTime"]
                else ""
            ),
            axis=1,
        )

        self.timekeepingDf.to_csv("./data/timekeeping.csv")

        self.timekeepingDf["absent"] = self.timekeepingDf.apply(
            lambda row: (
                0
                if row["status"] == "RD"
                or (
                    row["isResign"] == 1
                    and row["workingTime"].date() > row["resignDate"]
                )
                else (
                    1
                    if (row["finishedWork"] == 0) or (row["totalWorkHours"] <= 320)
                    else ""
                )
            ),
            axis=1,
        )

        self.timekeepingDf["totalWorkHours"] = self.timekeepingDf[
            "totalWorkHours"
        ].apply(lambda x: (int(x) if pd.notnull(x) and x != "" else None))

        self.timekeepingDf["late"] = self.timekeepingDf["late"].apply(
            lambda x: (int(x) if pd.notnull(x) and x != "" else None)
        )

        self.timekeepingDf.to_csv("./data/timekeeping.csv")

    def query_file(self):
        # merging all employees dates with timeIn timeOut
        restDf = self.restDf
        timekeepingDf = self.timekeepingDf

        query = """
            SELECT timekeepingDf.*,
            restDf.status 
            FROM timekeepingDf
            LEFT JOIN restDf
            on DATE(restDf.date) = DATE(timekeepingDf.workingTime) and restDf.uuid = timekeepingDf.uuid
            """
        self.timekeepingDf = psql.sqldf(query, locals())

    # implementing SQL query to join and merging

    def convert_to_json(self):
        data = self.timekeepingDf.to_json(orient="records")

        return json.loads(data)
