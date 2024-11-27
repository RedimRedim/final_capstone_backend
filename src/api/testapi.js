const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const Joi = require("joi");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { MongoDbManager } = require("../utils/mongodb-connection");
const { MongoDbEmployees } = require("../component/employeedb");
const { MongoDbSalary } = require("../component/salarydb.js");
const mongodb = new MongoDbManager();
const mongoDbEmployees = new MongoDbEmployees(mongodb);
const mongoDbSalary = new MongoDbSalary(mongodb);

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });
const port = process.env.PORT || 2000;
const apiUrl = process.env.RAILWAY_PROD_URL || "http://localhost:2000"; // Use the API URL from the environment or default to localhost

app.use(
  cors({
    origin: [
      "https://final-capstone-frontend-khaki.vercel.app", // Allow your specific frontend URL
      "http://localhost:3000", // Local development URL (change to match your local URL and port)
      "http://localhost:8080",
    ], // Another potential local dev URL if needed
    credentials: true, // Allow cookies (if needed)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow the necessary HTTP methods
    allowedHeaders: ["Content-Type"], // Allow Content-Type header
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const employeeSchema = Joi.object({
  name: Joi.string().min(5).required(),
  sex: Joi.string().valid("Male", "Female").required(),
  department: Joi.string().required(),
  employeeType: Joi.string().required(),
  role: Joi.string().required(),
  basicSalary: Joi.number().required(),
  dayOff: Joi.string().required(),
  salary: Joi.object().default({}),
  isResign: Joi.boolean().default(false), //first create automatically false
  resignDate: Joi.date().default(new Date("1970-01-01")), //first create automatically null
  updatedDate: Joi.date(),
});

//Middleware to parse JSON Bodies
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true, // Allow credentials if needed (cookies, authentication)
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.get(`/api/employees`, async (req, res) => {
  try {
    const { department, sex, employeeType } = req.query;
    const employees = await mongoDbEmployees.getAllEmployees({
      department,
      sex,
      employeeType,
    });

    if (!employees && !employees.length > 0) {
      return res
        .status(404)
        .send({ status: "fail", message: "employee not found" });
    }

    res.status(200).send({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: "server error" });
  }
});

app.get("/api/employees/monthly-total", async (req, res) => {
  console.log("gettting employes total");
  const data = await mongoDbEmployees.getMonthlyTotalEmployees();

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/monthly-salary", async (req, res) => {
  try {
    const data = await mongoDbSalary.getMonthlySalaryEmployees();
    res.status(200).send({
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/employees/monthly-department", async (req, res) => {
  const data = await mongoDbSalary.getMonthlyDepartment();

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employees = await mongoDbEmployees.getEmployeeById(employeeId);

    if (!employees) {
      return res
        .status(404)
        .send({ status: "fail", message: "employee not found" });
    }
    res.status(200).send({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: "server error" });
  }
});

//adding newEmployee POST request
app.post("/api/employees", async (req, res) => {
  const latestId = await mongoDbEmployees.getLatestId();

  const { error, value } = employeeSchema.validate(req.body);
  const createdDate = new Date().toISOString();
  const newEmployee = {
    uuid: `ID${latestId + 1}`,
    ...value,
    createdDate: createdDate,
    updatedDate: createdDate,
  };

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  mongoDbEmployees.insertEmployee(newEmployee);
  res.status(201).send(newEmployee);
});

app.post("/api/employees-sample-data", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/dbemp.employees.json");
    //fornow havent setup req.bodyfile something like this
    //just read file from DIR
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    jsonData.forEach((data) => {
      data.resignDate = new Date(data.resignDate);
    });

    await mongoDbEmployees.addSampleEmployeeData(jsonData);

    return res.status(200).send({ status: " success", message: jsonData });
  } catch (error) {
    return res.status(500).send({ status: " error", message: error.message });
  }
});

app.patch("/api/employees/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { error, value } = employeeSchema.validate(req.body);

    const employeeUpdatedData = {
      ...value,
      updatedDate: new Date().toISOString(),
    };

    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const result = await mongoDbEmployees.updateEmployee(
      employeeId,
      employeeUpdatedData
    );

    if (!result) {
      return res
        .status(400)
        .send({ status: "failed", message: "employee not found" });
    }

    res.status(200).send({
      status: "sucess",
      message: "employee details has been updated",
      result: result,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: "an error occured when trying to update employee",
    });
  }
});

app.delete(
  "/api/employees/:employeeId",
  async (req, res) => {
    const { employeeId } = req.params;

    try {
      const delEmployee = await mongoDbEmployees.deleteEmployee(employeeId);
      if (!delEmployee) {
        return res
          .status(404)
          .send({ status: "fail", message: "employee not found" });
      }

      res.status(200).send({
        status: "success",
        message: "employee has been deleted",
        data: employeeId,
      });
    } catch (error) {
      res.status(500).send({ status: "error", message: error });
    }
  },

  app.get("/api/salary", async (req, res) => {
    try {
      const { month, year } = req.query;
      const salaryData = await mongoDbSalary.getMonthlySalary({ month, year });

      if (!salaryData && !salaryData.length > 0) {
        return res
          .status(404)
          .send({ status: "fail", message: "salary not found" });
      }

      res.status(200).send({
        status: "success",
        data: salaryData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", message: "server error" });
    }
  })
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
