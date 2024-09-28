const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const Joi = require("joi");
const { nanoid } = require("nanoid");
const cors = require("cors");
const employees = [
  {
    uuid: "001",
    name: "Alice Smith",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: { Jan: 70000, Feb: 72000, Mar: 75000 },
    isResign: false,
    createdDate: "2022-01-15T09:00:00",
    updatedDate: "2023-01-10T10:30:00",
  },
  {
    uuid: "002",
    name: "Bob Johnson",
    sex: "Male",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: { Jan: 80000, Feb: 82000, Mar: 81000 },
    isResign: false,
    createdDate: "2022-02-20T11:00:00",
    updatedDate: "2023-02-15T14:45:00",
  },
  {
    uuid: "003",
    name: "Charlie Brown",
    sex: "Male",
    department: "ST",
    employeeType: "Regular",
    role: "DevOps Engineer",
    salary: { Jan: 65000, Feb: 67000, Mar: 66000 },
    isResign: false,
    createdDate: "2022-03-25T08:15:00",
    updatedDate: "2023-03-20T12:00:00",
  },
  {
    uuid: "004",
    name: "Diana Prince",
    sex: "Female",
    department: "ST",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: { Jan: 75000, Feb: 77000, Mar: 76000 },
    isResign: false,
    createdDate: "2022-04-30T13:30:00",
    updatedDate: "2023-04-25T09:00:00",
  },
  {
    uuid: "005",
    name: "Ethan Hunt",
    sex: "Male",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 72000, Feb: 74000, Mar: 73000 },
    isResign: false,
    createdDate: "2022-05-05T15:00:00",
    updatedDate: "2023-05-01T10:15:00",
  },
  {
    uuid: "006",
    name: "Fiona Gallagher",
    sex: "Female",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 68000, Feb: 69000, Mar: 70000 },
    isResign: false,
    createdDate: "2022-06-10T10:30:00",
    updatedDate: "2023-06-05T11:45:00",
  },
  {
    uuid: "007",
    name: "George Costanza",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 55000, Feb: 56000, Mar: 57000 },
    isResign: false,
    createdDate: "2022-07-15T09:45:00",
    updatedDate: "2023-07-10T14:00:00",
  },
  {
    uuid: "008",
    name: "Hannah Baker",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DBA",
    salary: { Jan: 90000, Feb: 92000, Mar: 91000 },
    isResign: false,
    createdDate: "2022-08-20T11:15:00",
    updatedDate: "2023-08-15T12:30:00",
  },
  {
    uuid: "009",
    name: "Ian Malcolm",
    sex: "Male",
    department: "FT",
    employeeType: "Regular",
    role: "Sotware Engineer",
    salary: { Jan: 85000, Feb: 87000, Mar: 86000 },
    isResign: false,
    createdDate: "2022-09-25T10:00:00",
    updatedDate: "2023-09-20T13:00:00",
  },
  {
    uuid: "010",
    name: "Jane Doe",
    sex: "Female",
    department: "ST",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 95000, Feb: 97000, Mar: 96000 },
    isResign: false,
    createdDate: "2022-10-30T08:30:00",
    updatedDate: "2023-10-25T16:00:00",
  },
  {
    uuid: "011",
    name: "Kevin Hart",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Sotware Engineer",
    salary: { Jan: 92000, Feb: 94000, Mar: 93000 },
    isResign: false,
    createdDate: "2022-11-05T09:00:00",
    updatedDate: "2023-11-01T10:30:00",
  },
  {
    uuid: "012",
    name: "Laura Croft",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 62000, Feb: 63000, Mar: 64000 },
    isResign: false,
    createdDate: "2022-12-10T11:00:00",
    updatedDate: "2023-12-05T12:00:00",
  },
  {
    uuid: "013",
    name: "Michael Scott",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Sotware Engineer",
    salary: { Jan: 78000, Feb: 80000, Mar: 79000 },
    isResign: false,
    createdDate: "2023-01-15T09:30:00",
    updatedDate: "2023-01-20T10:00:00",
  },
  {
    uuid: "014",
    name: "Nina Williams",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 60000, Feb: 61000, Mar: 62000 },
    isResign: false,
    createdDate: "2023-02-18T11:00:00",
    updatedDate: "2023-02-25T12:15:00",
  },
  {
    uuid: "015",
    name: "Oliver Queen",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 72000, Feb: 74000, Mar: 73000 },
    isResign: false,
    createdDate: "2023-03-22T09:45:00",
    updatedDate: "2023-03-28T10:30:00",
  },
  {
    uuid: "016",
    name: "Paula Patton",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "Sotware Engineer",
    salary: { Jan: 65000, Feb: 67000, Mar: 66000 },
    isResign: false,
    createdDate: "2023-04-30T13:00:00",
    updatedDate: "2023-05-05T14:00:00",
  },
  {
    uuid: "017",
    name: "Quentin Tarantino",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 70000, Feb: 71000, Mar: 72000 },
    isResign: false,
    createdDate: "2023-05-15T10:00:00",
    updatedDate: "2023-05-20T11:15:00",
  },
  {
    uuid: "018",
    name: "Rachel Green",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "DBA",
    salary: { Jan: 64000, Feb: 65000, Mar: 66000 },
    isResign: false,
    createdDate: "2023-06-10T09:30:00",
    updatedDate: "2023-06-15T10:45:00",
  },
  {
    uuid: "019",
    name: "Steve Rogers",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: { Jan: 85000, Feb: 87000, Mar: 86000 },
    isResign: false,
    createdDate: "2023-07-20T08:00:00",
    updatedDate: "2023-07-25T09:30:00",
  },
  {
    uuid: "020",
    name: "Tina Fey",
    sex: "Female",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: { Jan: 62000, Feb: 63000, Mar: 64000 },
    isResign: false,
    createdDate: "2023-08-30T10:15:00",
    updatedDate: "2023-09-05T11:00:00",
  },
];

dotenv.config();
const port = process.env.PORT;

const employeeSchema = Joi.object({
  name: Joi.string().min(5).required(),
  sex: Joi.string().valid("Male", "Female").required(),
  department: Joi.string().required(),
  employeeType: Joi.string().required(),
  role: Joi.string().required(),
  salary: Joi.object().default({}),
  isResign: Joi.boolean().default(false), //first create automatically false
});

//Middleware to parse JSON Bodies
app.use(bodyParser.json());
app.use(cors());
app.get("/api/employees", (req, res) => {
  const { department, sex, employeeType } = req.query;
  if (!employees && !employees.length > 0) {
    return res
      .status(404)
      .send({ status: "fail", message: "employee not found" });
  }
  if (department || sex || employeeType) {
    const finalResult = employees.filter((employee) => {
      const matchedDepartment = department
        ? employee.department.toLowerCase().includes(department.toLowerCase())
        : true;
      const matchedSex = sex
        ? employee.sex.toLowerCase().includes(sex.toLowerCase())
        : true;
      const matchedEmployeeType = employeeType
        ? employee.employeeType
            .toLowerCase()
            .includes(employeeType.toLowerCase())
        : true;

      return matchedDepartment && matchedSex && matchedEmployeeType;
    });
    return res.status(200).send({ finalResult });
  }

  res.status(200).send({ employees });
});

app.get("/api/employees/monthly-salaries", (req, res) => {
  const data = {
    jan: 5000000,
    feb: 5950000,
    mar: 5760000,
  };

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const employee = employees.find((employee) => employee.uuid == employeeId);

  if (!employee) {
    return res
      .status(404)
      .send({ status: "fail", message: "employee not found" });
  }

  res.status(200).send({ employee });
});

//adding newEmployee POST request
app.post("/employees", (req, res) => {
  const { error, value } = employeeSchema.validate(req.body);
  const createdDate = new Date().toISOString();
  const newEmployee = {
    uuid: nanoid(),
    ...value,
    salary: value.salary,
    isResign: value.resign,
    createdDate: createdDate,
    updatedDate: createdDate,
  };

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  employees.push(newEmployee);
  res.status(201).send(newEmployee);
});

app.put("/employees/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const { error, value } = employeeSchema.validate(req.body);
  const employeeIndex = employees.findIndex(
    (employee) => employee.uuid == employeeId
  );

  if (employeeIndex === -1) {
    return res
      .status(404)
      .send({ status: "fail", message: "employee not found" });
  }

  if (error) {
    return res
      .status(400)
      .send({ status: "fail", message: error.details[0].message });
  }

  const employeeUpdatedData = {
    uuid: employeeId,
    ...value,
    updatedDate: new Date().toISOString(),
    salary: value.salary,
    isResign: value.resign,
  };

  employees[employeeIndex] = employeeUpdatedData;
  res.status(200).send({
    status: "success",
    data: employees[employeeIndex],
    message: "employee details has been updated",
  });
});

app.delete("/employees/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const employeeIndex = employees.findIndex(
    (employee) => employee.uuid == employeeId
  );

  if (!employeeIndex) {
    res.status(404).send({ status: "fail", message: "employee not found" });
  }

  //employees.splice(employeeIndex, 1);
  res.status(200).send({
    status: "success",
    data: employees[employeeIndex],
    message: "employee has been deleted",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
