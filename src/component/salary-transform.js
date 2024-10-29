const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");

const filePath = "../../test_salary.xlsx";

try {
  if (filePath.endsWith(".xlsx")) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON with date formatting
    const data = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Use raw: false to convert dates to JavaScript Date objects
      dateNF: "yyyy-mm-dd hh:mm:ss", // Specify the date format
    });

    data.
  } else if (filePath.endsWith(".csv")) {
    const data = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
      })
      .on("end", () => {
        console.log("CSV file parsed successfully");
      })
      .on("error", (error) => {
        console.log(error);
      });
  }
} catch (error) {
  console.log(error);
}
