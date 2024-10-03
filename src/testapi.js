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
    salary: {
      Jan: 70000,
      Feb: 72000,
      Mar: 75000,
      Apr: 76000,
      May: 77000,
      Jun: 78000,
    },
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
    salary: {
      Jan: 80000,
      Feb: 82000,
      Mar: 81000,
      Apr: 83000,
      May: 84000,
      Jun: 85000,
    },
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
    salary: {
      Jan: 65000,
      Feb: 67000,
      Mar: 66000,
      Apr: 68000,
      May: 69000,
      Jun: 70000,
    },
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
    salary: {
      Jan: 75000,
      Feb: 77000,
      Mar: 76000,
      Apr: 78000,
      May: 79000,
      Jun: 80000,
    },
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
    salary: {
      Jan: 72000,
      Feb: 74000,
      Mar: 73000,
      Apr: 75000,
      May: 76000,
      Jun: 77000,
    },
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
    salary: {
      Jan: 68000,
      Feb: 69000,
      Mar: 70000,
      Apr: 71000,
      May: 72000,
      Jun: 73000,
    },
    isResign: false,
    createdDate: "2022-06-10T10:30:00",
    updatedDate: "2023-06-05T11:45:00",
  },
  {
    uuid: "007",
    name: "George Martin",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 76000,
      Feb: 77000,
      Mar: 78000,
      Apr: 79000,
      May: 80000,
      Jun: 81000,
    },
    isResign: false,
    createdDate: "2022-07-15T09:00:00",
    updatedDate: "2023-07-10T10:30:00",
  },
  {
    uuid: "008",
    name: "Hannah Lee",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: {
      Jan: 82000,
      Feb: 83000,
      Mar: 84000,
      Apr: 85000,
      May: 86000,
      Jun: 87000,
    },
    isResign: false,
    createdDate: "2022-08-20T11:00:00",
    updatedDate: "2023-08-15T14:45:00",
  },
  {
    uuid: "009",
    name: "Ian Wright",
    sex: "Male",
    department: "ST",
    employeeType: "Regular",
    role: "DevOps Engineer",
    salary: {
      Jan: 67000,
      Feb: 68000,
      Mar: 69000,
      Apr: 70000,
      May: 71000,
      Jun: 72000,
    },
    isResign: false,
    createdDate: "2022-09-25T08:15:00",
    updatedDate: "2023-09-20T12:00:00",
  },
  {
    uuid: "010",
    name: "Jane Doe",
    sex: "Female",
    department: "ST",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 77000,
      Feb: 78000,
      Mar: 79000,
      Apr: 80000,
      May: 81000,
      Jun: 82000,
    },
    isResign: false,
    createdDate: "2022-10-30T13:30:00",
    updatedDate: "2023-10-25T09:00:00",
  },
  {
    uuid: "011",
    name: "Kevin Smith",
    sex: "Male",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 74000,
      Feb: 75000,
      Mar: 76000,
      Apr: 77000,
      May: 78000,
      Jun: 79000,
    },
    isResign: false,
    createdDate: "2022-11-05T15:00:00",
    updatedDate: "2023-11-01T10:15:00",
  },
  {
    uuid: "012",
    name: "Laura Johnson",
    sex: "Female",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 69000,
      Feb: 70000,
      Mar: 71000,
      Apr: 72000,
      May: 73000,
      Jun: 74000,
    },
    isResign: false,
    createdDate: "2022-12-10T10:30:00",
    updatedDate: "2023-12-05T11:45:00",
  },
  {
    uuid: "013",
    name: "Michael Brown",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 78000,
      Feb: 79000,
      Mar: 80000,
      Apr: 81000,
      May: 82000,
      Jun: 83000,
    },
    isResign: false,
    createdDate: "2023-01-15T09:00:00",
    updatedDate: "2024-01-10T10:30:00",
  },
  {
    uuid: "014",
    name: "Nina Williams",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: {
      Jan: 83000,
      Feb: 84000,
      Mar: 85000,
      Apr: 86000,
      May: 87000,
      Jun: 88000,
    },
    isResign: false,
    createdDate: "2023-02-20T11:00:00",
    updatedDate: "2024-02-15T14:45:00",
  },
  {
    uuid: "007",
    name: "George Martin",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 76000,
      Feb: 77000,
      Mar: 78000,
      Apr: 79000,
      May: 80000,
      Jun: 81000,
    },
    isResign: false,
    createdDate: "2022-07-15T09:00:00",
    updatedDate: "2023-07-10T10:30:00",
  },
  {
    uuid: "008",
    name: "Hannah Lee",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: {
      Jan: 82000,
      Feb: 83000,
      Mar: 84000,
      Apr: 85000,
      May: 86000,
      Jun: 87000,
    },
    isResign: false,
    createdDate: "2022-08-20T11:00:00",
    updatedDate: "2023-08-15T14:45:00",
  },
  {
    uuid: "009",
    name: "Ian Wright",
    sex: "Male",
    department: "ST",
    employeeType: "Regular",
    role: "DevOps Engineer",
    salary: {
      Jan: 67000,
      Feb: 68000,
      Mar: 69000,
      Apr: 70000,
      May: 71000,
      Jun: 72000,
    },
    isResign: false,
    createdDate: "2022-09-25T08:15:00",
    updatedDate: "2023-09-20T12:00:00",
  },
  {
    uuid: "010",
    name: "Jane Doe",
    sex: "Female",
    department: "ST",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 77000,
      Feb: 78000,
      Mar: 79000,
      Apr: 80000,
      May: 81000,
      Jun: 82000,
    },
    isResign: false,
    createdDate: "2022-10-30T13:30:00",
    updatedDate: "2023-10-25T09:00:00",
  },
  {
    uuid: "011",
    name: "Kevin Smith",
    sex: "Male",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 74000,
      Feb: 75000,
      Mar: 76000,
      Apr: 77000,
      May: 78000,
      Jun: 79000,
    },
    isResign: false,
    createdDate: "2022-11-05T15:00:00",
    updatedDate: "2023-11-01T10:15:00",
  },
  {
    uuid: "012",
    name: "Laura Johnson",
    sex: "Female",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 69000,
      Feb: 70000,
      Mar: 71000,
      Apr: 72000,
      May: 73000,
      Jun: 74000,
    },
    isResign: false,
    createdDate: "2022-12-10T10:30:00",
    updatedDate: "2023-12-05T11:45:00",
  },
  {
    uuid: "013",
    name: "Michael Brown",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 78000,
      Feb: 79000,
      Mar: 80000,
      Apr: 81000,
      May: 82000,
      Jun: 83000,
    },
    isResign: false,
    createdDate: "2023-01-15T09:00:00",
    updatedDate: "2024-01-10T10:30:00",
  },
  {
    uuid: "014",
    name: "Nina Williams",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: {
      Jan: 83000,
      Feb: 84000,
      Mar: 85000,
      Apr: 86000,
      May: 87000,
      Jun: 88000,
    },
    isResign: false,
    createdDate: "2023-02-20T11:00:00",
    updatedDate: "2024-02-15T14:45:00",
  },
  {
    uuid: "015",
    name: "Oscar Martinez",
    sex: "Male",
    department: "ST",
    employeeType: "Regular",
    role: "DevOps Engineer",
    salary: {
      Jan: 68000,
      Feb: 69000,
      Mar: 70000,
      Apr: 71000,
      May: 72000,
      Jun: 73000,
    },
    isResign: false,
    createdDate: "2023-03-25T08:15:00",
    updatedDate: "2024-03-20T12:00:00",
  },
  {
    uuid: "016",
    name: "Paula Abdul",
    sex: "Female",
    department: "ST",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 78000,
      Feb: 79000,
      Mar: 80000,
      Apr: 81000,
      May: 82000,
      Jun: 83000,
    },
    isResign: false,
    createdDate: "2023-04-30T13:30:00",
    updatedDate: "2024-04-25T09:00:00",
  },
  {
    uuid: "017",
    name: "Quincy Adams",
    sex: "Male",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 75000,
      Feb: 76000,
      Mar: 77000,
      Apr: 78000,
      May: 79000,
      Jun: 80000,
    },
    isResign: false,
    createdDate: "2023-05-05T15:00:00",
    updatedDate: "2024-05-01T10:15:00",
  },
  {
    uuid: "018",
    name: "Rachel Green",
    sex: "Female",
    department: "FT",
    employeeType: "Regular",
    role: "DBA",
    salary: {
      Jan: 70000,
      Feb: 71000,
      Mar: 72000,
      Apr: 73000,
      May: 74000,
      Jun: 75000,
    },
    isResign: false,
    createdDate: "2023-06-10T10:30:00",
    updatedDate: "2024-06-05T11:45:00",
  },
  {
    uuid: "019",
    name: "Sam Wilson",
    sex: "Male",
    department: "IT",
    employeeType: "Regular",
    role: "Software Engineer",
    salary: {
      Jan: 79000,
      Feb: 80000,
      Mar: 81000,
      Apr: 82000,
      May: 83000,
      Jun: 84000,
    },
    isResign: false,
    createdDate: "2023-07-15T09:00:00",
    updatedDate: "2024-07-10T10:30:00",
  },
  {
    uuid: "020",
    name: "Tina Turner",
    sex: "Female",
    department: "IT",
    employeeType: "Probation",
    role: "DevOps Engineer",
    salary: {
      Jan: 84000,
      Feb: 85000,
      Mar: 86000,
      Apr: 87000,
      May: 88000,
      Jun: 89000,
    },
    isResign: false,
    createdDate: "2023-08-20T11:00:00",
    updatedDate: "2024-08-15T14:45:00",
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

app.get("/api/employees/monthly-salary", (req, res) => {
  const data = {
    Jan: 5000000,
    Feb: 5950000,
    Mar: 5760000,
    Apr: 5000000,
    May: 5200000,
    Jun: 5500000,
    Jul: 5800000,
    Aug: 5000000,
    Sep: 5400000,
  };

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/monthly-salary", (req, res) => {
  const data = {
    Jan: 5000000,
    Feb: 5950000,
    Mar: 5760000,
    Apr: 5000000,
    May: 5200000,
    Jun: 5500000,
    Jul: 5800000,
    Aug: 5000000,
    Sep: 5400000,
  };

  res.status(200).send({
    data,
  });
});

app.get("/api/employees/monthly-department", (req, res) => {
  const data = {
    jan: { IT: 2, ST: 1, FT: 2 },
    feb: { IT: 5, ST: 3, FT: 5 },
    mar: { IT: 3, ST: 2, FT: 2 },
    apr: { IT: 2, ST: 2, FT: 3 },
    may: { IT: 1, ST: 1, FT: 2 },
    jun: { IT: 3, ST: 1, FT: 2 },
    jul: { IT: 2, ST: 2, FT: 3 },
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
