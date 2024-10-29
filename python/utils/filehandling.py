import pandas as pd
import pandasql as psql


class FileHandling:
    def __init__(self, filePath):
        self.filePath = filePath
        self.mainDf = None
        self.restDf = None

    def init_file(self):
        self.read_file()
        self.calculate_file()
        self.monthly_timekeeping_dates("2024-07-01", "2024-07-30")
        # self.query_file()

    def read_file(self):
        if self.filePath.endswith(".xlsx"):
            self.mainDf = pd.read_excel(self.filePath)
            self.restDf = pd.read_excel(self.filePath, sheet_name="RD")
        elif self.filePath.endswith(".csv"):
            self.mainDf = pd.read_csv(self.filePath)
            self.restDf = pd.read_csv(self.filePath, sheet_name="RD")

    def calculate_file(self):
        self.mainDf["timeIn"] = pd.to_datetime(self.mainDf["timeIn"])
        self.mainDf["timeOut"] = pd.to_datetime(self.mainDf["timeOut"])
        self.mainDf["totalWorkHours"] = self.mainDf["timeOut"] - self.mainDf["timeIn"]

        self.mainDf["totalWorkHours"] = self.mainDf.apply(
            lambda row: row["totalWorkHours"].total_seconds() / 3600, axis=1
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
                if pd.isna(row["timeIn"])
                and pd.isna(row["timeOut"])
                and row["workingTime"] != "RD"
                and pd.isna(row["totalWorkHours"])
                else ""
            ),
            axis=1,
        )

    def calculate_rest(self, start, end):

        employeesDf = self.mainDf.drop_duplicates(subset=["uuid"], keep="first")
        employeesDf = employeesDf[["uuid", "name"]]

        dates = pd.date_range(start, end)
        datesDf = pd.DataFrame({"date": dates})
        employeesDf["key"] = 1
        datesDf["key"] = 1

        result = pd.merge(employeesDf, datesDf, on="key").drop("key", axis=1)
        restDf = self.restDf
        query = """SELECT result.uuid, result.name, DATE(result.date), restDf.status FROM result LEFT JOIN restDf on restDf.date = result.date"""
        self.restDf = psql.sqldf(query, locals())

    def query_file(self):
        # datesDf = self.datesDf
        # mainDf = self.mainDf

        query = """
            SELECT datesDf.*,
            FROM datesDf
            LEFT JOIN self.mainDf
            on datesDf.date = self.mainDf.date
            """
        resultSqlDf = psql.sqldf(query, locals())
        print(resultSqlDf)

    # implementing SQL query to join and merging
