const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const Joi = require("joi");
const cors = require("cors");
const { MongoDb } = require("../db/db");
const path = require("path");
const mongodb = new MongoDb();
mongodb.connectDb();

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

const port = process.env.PORT;

const employeeSchema = Joi.object({
  name: Joi.string().min(5).required(),
  sex: Joi.string().valid("Male", "Female").required(),
  department: Joi.string().required(),
  employeeType: Joi.string().required(),
  role: Joi.string().required(),
  salary: Joi.object().default({}),
  isResign: Joi.boolean().default(false), //first create automatically false
  resignDate: Joi.date().default(null), //first create automatically null
});

//Middleware to parse JSON Bodies
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:8081"], // Allow only this origin
  })
);

app.get("/api/employees", async (req, res) => {
  try {
    const { department, sex, employeeType } = req.query;
    const employees = await mongodb.getAllEmployees({
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

app.get("/api/employees/monthly-salary", async (req, res) => {
  const data = await mongodb.getMonthlySalary();

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/monthly-department", async (req, res) => {
  'EXPECTING REQ.QUERY.DATE FORMAT = "2024-05"';
  const data = await mongodb.getMonthlyDepartment(req.query.date);

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employees = await mongodb.getEmployeeById(employeeId);

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
app.post("/api/employees", (req, res) => {
  const { error, value } = employeeSchema.validate(req.body);
  const createdDate = new Date().toISOString();
  const newEmployee = {
    //uuid: nanoid(),
    ...value,
    salary: value.salary,
    isResign: false,
    createdDate: createdDate,
    updatedDate: createdDate,
  };

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  mongodb.insertEmployee(newEmployee);
  res.status(201).send(newEmployee);
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

    const result = await mongodb.updateEmployee(
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

app.delete("/api/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const delEmployee = await mongodb.deleteEmployee(employeeId);
    if (!delEmployee) {
      return res
        .status(404)
        .send({ status: "fail", message: "employee not found" });
    }

    res.status(200).send({
      status: "success",
      message: "employee has been deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: "server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
