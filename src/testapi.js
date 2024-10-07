const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const Joi = require("joi");
const cors = require("cors");
const { MongoDb } = require("./db.js");

// const employees = [
//   {
//     uuid: "001",
//     name: "Alice Smith",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 70000,
//       Feb: 72000,
//       Mar: 75000,
//       Apr: 76000,
//       May: 77000,
//       Jun: 78000,
//     },
//     isResign: false,
//     createdDate: "2022-01-15T09:00:00",
//     updatedDate: "2023-01-10T10:30:00",
//   },
//   {
//     uuid: "002",
//     name: "Bob Johnson",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 80000,
//       Feb: 82000,
//       Mar: 81000,
//       Apr: 83000,
//       May: 84000,
//       Jun: 85000,
//     },
//     isResign: false,
//     createdDate: "2022-02-20T11:00:00",
//     updatedDate: "2023-02-15T14:45:00",
//   },
//   {
//     uuid: "003",
//     name: "Charlie Brown",
//     sex: "Male",
//     department: "ST",
//     employeeType: "Regular",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 65000,
//       Feb: 67000,
//       Mar: 66000,
//       Apr: 68000,
//       May: 69000,
//       Jun: 70000,
//     },
//     isResign: false,
//     createdDate: "2022-03-25T08:15:00",
//     updatedDate: "2023-03-20T12:00:00",
//   },
//   {
//     uuid: "004",
//     name: "Diana Prince",
//     sex: "Female",
//     department: "ST",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 75000,
//       Feb: 77000,
//       Mar: 76000,
//       Apr: 78000,
//       May: 79000,
//       Jun: 80000,
//     },
//     isResign: false,
//     createdDate: "2022-04-30T13:30:00",
//     updatedDate: "2023-04-25T09:00:00",
//   },
//   {
//     uuid: "005",
//     name: "Ethan Hunt",
//     sex: "Male",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 72000,
//       Feb: 74000,
//       Mar: 73000,
//       Apr: 75000,
//       May: 76000,
//       Jun: 77000,
//     },
//     isResign: false,
//     createdDate: "2022-05-05T15:00:00",
//     updatedDate: "2023-05-01T10:15:00",
//   },
//   {
//     uuid: "006",
//     name: "Fiona Gallagher",
//     sex: "Female",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 68000,
//       Feb: 69000,
//       Mar: 70000,
//       Apr: 71000,
//       May: 72000,
//       Jun: 73000,
//     },
//     isResign: false,
//     createdDate: "2022-06-10T10:30:00",
//     updatedDate: "2023-06-05T11:45:00",
//   },
//   {
//     uuid: "007",
//     name: "George Martin",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 76000,
//       Feb: 77000,
//       Mar: 78000,
//       Apr: 79000,
//       May: 80000,
//       Jun: 81000,
//     },
//     isResign: false,
//     createdDate: "2022-07-15T09:00:00",
//     updatedDate: "2023-07-10T10:30:00",
//   },
//   {
//     uuid: "008",
//     name: "Hannah Lee",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 82000,
//       Feb: 83000,
//       Mar: 84000,
//       Apr: 85000,
//       May: 86000,
//       Jun: 87000,
//     },
//     isResign: false,
//     createdDate: "2022-08-20T11:00:00",
//     updatedDate: "2023-08-15T14:45:00",
//   },
//   {
//     uuid: "009",
//     name: "Ian Wright",
//     sex: "Male",
//     department: "ST",
//     employeeType: "Regular",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 67000,
//       Feb: 68000,
//       Mar: 69000,
//       Apr: 70000,
//       May: 71000,
//       Jun: 72000,
//     },
//     isResign: false,
//     createdDate: "2022-09-25T08:15:00",
//     updatedDate: "2023-09-20T12:00:00",
//   },
//   {
//     uuid: "010",
//     name: "Jane Doe",
//     sex: "Female",
//     department: "ST",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 77000,
//       Feb: 78000,
//       Mar: 79000,
//       Apr: 80000,
//       May: 81000,
//       Jun: 82000,
//     },
//     isResign: false,
//     createdDate: "2022-10-30T13:30:00",
//     updatedDate: "2023-10-25T09:00:00",
//   },
//   {
//     uuid: "011",
//     name: "Kevin Smith",
//     sex: "Male",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 74000,
//       Feb: 75000,
//       Mar: 76000,
//       Apr: 77000,
//       May: 78000,
//       Jun: 79000,
//     },
//     isResign: false,
//     createdDate: "2022-11-05T15:00:00",
//     updatedDate: "2023-11-01T10:15:00",
//   },
//   {
//     uuid: "012",
//     name: "Laura Johnson",
//     sex: "Female",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 69000,
//       Feb: 70000,
//       Mar: 71000,
//       Apr: 72000,
//       May: 73000,
//       Jun: 74000,
//     },
//     isResign: false,
//     createdDate: "2022-12-10T10:30:00",
//     updatedDate: "2023-12-05T11:45:00",
//   },
//   {
//     uuid: "013",
//     name: "Michael Brown",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 78000,
//       Feb: 79000,
//       Mar: 80000,
//       Apr: 81000,
//       May: 82000,
//       Jun: 83000,
//     },
//     isResign: false,
//     createdDate: "2023-01-15T09:00:00",
//     updatedDate: "2024-01-10T10:30:00",
//   },
//   {
//     uuid: "014",
//     name: "Nina Williams",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 83000,
//       Feb: 84000,
//       Mar: 85000,
//       Apr: 86000,
//       May: 87000,
//       Jun: 88000,
//     },
//     isResign: false,
//     createdDate: "2023-02-20T11:00:00",
//     updatedDate: "2024-02-15T14:45:00",
//   },
//   {
//     uuid: "007",
//     name: "George Martin",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 76000,
//       Feb: 77000,
//       Mar: 78000,
//       Apr: 79000,
//       May: 80000,
//       Jun: 81000,
//     },
//     isResign: false,
//     createdDate: "2022-07-15T09:00:00",
//     updatedDate: "2023-07-10T10:30:00",
//   },
//   {
//     uuid: "008",
//     name: "Hannah Lee",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 82000,
//       Feb: 83000,
//       Mar: 84000,
//       Apr: 85000,
//       May: 86000,
//       Jun: 87000,
//     },
//     isResign: false,
//     createdDate: "2022-08-20T11:00:00",
//     updatedDate: "2023-08-15T14:45:00",
//   },
//   {
//     uuid: "009",
//     name: "Ian Wright",
//     sex: "Male",
//     department: "ST",
//     employeeType: "Regular",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 67000,
//       Feb: 68000,
//       Mar: 69000,
//       Apr: 70000,
//       May: 71000,
//       Jun: 72000,
//     },
//     isResign: false,
//     createdDate: "2022-09-25T08:15:00",
//     updatedDate: "2023-09-20T12:00:00",
//   },
//   {
//     uuid: "010",
//     name: "Jane Doe",
//     sex: "Female",
//     department: "ST",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 77000,
//       Feb: 78000,
//       Mar: 79000,
//       Apr: 80000,
//       May: 81000,
//       Jun: 82000,
//     },
//     isResign: false,
//     createdDate: "2022-10-30T13:30:00",
//     updatedDate: "2023-10-25T09:00:00",
//   },
//   {
//     uuid: "011",
//     name: "Kevin Smith",
//     sex: "Male",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 74000,
//       Feb: 75000,
//       Mar: 76000,
//       Apr: 77000,
//       May: 78000,
//       Jun: 79000,
//     },
//     isResign: false,
//     createdDate: "2022-11-05T15:00:00",
//     updatedDate: "2023-11-01T10:15:00",
//   },
//   {
//     uuid: "012",
//     name: "Laura Johnson",
//     sex: "Female",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 69000,
//       Feb: 70000,
//       Mar: 71000,
//       Apr: 72000,
//       May: 73000,
//       Jun: 74000,
//     },
//     isResign: false,
//     createdDate: "2022-12-10T10:30:00",
//     updatedDate: "2023-12-05T11:45:00",
//   },
//   {
//     uuid: "013",
//     name: "Michael Brown",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 78000,
//       Feb: 79000,
//       Mar: 80000,
//       Apr: 81000,
//       May: 82000,
//       Jun: 83000,
//     },
//     isResign: false,
//     createdDate: "2023-01-15T09:00:00",
//     updatedDate: "2024-01-10T10:30:00",
//   },
//   {
//     uuid: "014",
//     name: "Nina Williams",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 83000,
//       Feb: 84000,
//       Mar: 85000,
//       Apr: 86000,
//       May: 87000,
//       Jun: 88000,
//     },
//     isResign: false,
//     createdDate: "2023-02-20T11:00:00",
//     updatedDate: "2024-02-15T14:45:00",
//   },
//   {
//     uuid: "015",
//     name: "Oscar Martinez",
//     sex: "Male",
//     department: "ST",
//     employeeType: "Regular",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 68000,
//       Feb: 69000,
//       Mar: 70000,
//       Apr: 71000,
//       May: 72000,
//       Jun: 73000,
//     },
//     isResign: false,
//     createdDate: "2023-03-25T08:15:00",
//     updatedDate: "2024-03-20T12:00:00",
//   },
//   {
//     uuid: "016",
//     name: "Paula Abdul",
//     sex: "Female",
//     department: "ST",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 78000,
//       Feb: 79000,
//       Mar: 80000,
//       Apr: 81000,
//       May: 82000,
//       Jun: 83000,
//     },
//     isResign: false,
//     createdDate: "2023-04-30T13:30:00",
//     updatedDate: "2024-04-25T09:00:00",
//   },
//   {
//     uuid: "017",
//     name: "Quincy Adams",
//     sex: "Male",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 75000,
//       Feb: 76000,
//       Mar: 77000,
//       Apr: 78000,
//       May: 79000,
//       Jun: 80000,
//     },
//     isResign: false,
//     createdDate: "2023-05-05T15:00:00",
//     updatedDate: "2024-05-01T10:15:00",
//   },
//   {
//     uuid: "018",
//     name: "Rachel Green",
//     sex: "Female",
//     department: "FT",
//     employeeType: "Regular",
//     role: "DBA",
//     salary: {
//       Jan: 70000,
//       Feb: 71000,
//       Mar: 72000,
//       Apr: 73000,
//       May: 74000,
//       Jun: 75000,
//     },
//     isResign: false,
//     createdDate: "2023-06-10T10:30:00",
//     updatedDate: "2024-06-05T11:45:00",
//   },
//   {
//     uuid: "019",
//     name: "Sam Wilson",
//     sex: "Male",
//     department: "IT",
//     employeeType: "Regular",
//     role: "Software Engineer",
//     salary: {
//       Jan: 79000,
//       Feb: 80000,
//       Mar: 81000,
//       Apr: 82000,
//       May: 83000,
//       Jun: 84000,
//     },
//     isResign: false,
//     createdDate: "2023-07-15T09:00:00",
//     updatedDate: "2024-07-10T10:30:00",
//   },
//   {
//     uuid: "020",
//     name: "Tina Turner",
//     sex: "Female",
//     department: "IT",
//     employeeType: "Probation",
//     role: "DevOps Engineer",
//     salary: {
//       Jan: 84000,
//       Feb: 85000,
//       Mar: 86000,
//       Apr: 87000,
//       May: 88000,
//       Jun: 89000,
//     },
//     isResign: false,
//     createdDate: "2023-08-20T11:00:00",
//     updatedDate: "2024-08-15T14:45:00",
//   },
// ];
const MongoDbClient = new MongoDb();
MongoDbClient.connectDb();

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
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:8081"], // Allow only this origin
  })
);

app.get("/api/employees", async (req, res) => {
  try {
    const { department, sex, employeeType } = req.query;
    const employees = await MongoDbClient.getAllEmployees({
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
  // const data = [
  //   {
  //     month: "Jan",
  //     salary: 500000,
  //     totalEmployees: 5,
  //     totalMale: 3,
  //     totalFemale: 2,
  //     totalRegular: 4,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 3,
  //       ST: 1,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Feb",
  //     salary: 520000,
  //     totalEmployees: 5,
  //     totalMale: 3,
  //     totalFemale: 2,
  //     totalRegular: 4,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 3,
  //       ST: 1,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Mar",
  //     salary: 530000,
  //     totalEmployees: 6,
  //     totalMale: 4,
  //     totalFemale: 2,
  //     totalRegular: 5,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 3,
  //       ST: 2,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Apr",
  //     salary: 540000,
  //     totalEmployees: 6,
  //     totalMale: 4,
  //     totalFemale: 2,
  //     totalRegular: 5,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 3,
  //       ST: 2,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "May",
  //     salary: 550000,
  //     totalEmployees: 7,
  //     totalMale: 4,
  //     totalFemale: 3,
  //     totalRegular: 6,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 4,
  //       ST: 2,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Jun",
  //     salary: 560000,
  //     totalEmployees: 7,
  //     totalMale: 4,
  //     totalFemale: 3,
  //     totalRegular: 6,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 4,
  //       ST: 2,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Jul",
  //     salary: 570000,
  //     totalEmployees: 8,
  //     totalMale: 5,
  //     totalFemale: 3,
  //     totalRegular: 7,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 4,
  //       ST: 3,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Aug",
  //     salary: 580000,
  //     totalEmployees: 8,
  //     totalMale: 5,
  //     totalFemale: 3,
  //     totalRegular: 7,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 4,
  //       ST: 3,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Sep",
  //     salary: 590000,
  //     totalEmployees: 9,
  //     totalMale: 5,
  //     totalFemale: 4,
  //     totalRegular: 8,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 5,
  //       ST: 3,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Oct",
  //     salary: 600000,
  //     totalEmployees: 10,
  //     totalMale: 6,
  //     totalFemale: 4,
  //     totalRegular: 9,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 5,
  //       ST: 4,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Nov",
  //     salary: 610000,
  //     totalEmployees: 10,
  //     totalMale: 6,
  //     totalFemale: 4,
  //     totalRegular: 9,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 5,
  //       ST: 4,
  //       IT: 1,
  //     },
  //   },
  //   {
  //     month: "Dec",
  //     salary: 620000,
  //     totalEmployees: 11,
  //     totalMale: 7,
  //     totalFemale: 4,
  //     totalRegular: 10,
  //     totalProbation: 1,
  //     departments: {
  //       FT: 6,
  //       ST: 4,
  //       IT: 1,
  //     },
  //   },
  // ];

  const data = await MongoDbClient.getMonthlySalary();

  res.status(200).send({
    data,
  });
});

// app.get("/api/employees/monthly-department", async (req, res) => {
//   // const data = {
//   //   jan: { IT: 2, ST: 1, FT: 2 },
//   //   feb: { IT: 5, ST: 3, FT: 5 },
//   //   mar: { IT: 3, ST: 2, FT: 2 },
//   //   apr: { IT: 2, ST: 2, FT: 3 },
//   //   may: { IT: 1, ST: 1, FT: 2 },
//   //   jun: { IT: 3, ST: 1, FT: 2 },
//   //   jul: { IT: 2, ST: 2, FT: 3 },
//   // };

//   const data = await MongoDbClient.monthlyDepartmentTotal();

//   res.status(200).send({
//     data,
//   });
// });

app.get("/api/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employees = await MongoDbClient.getEmployeeById(employeeId);

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

  MongoDbClient.insertEmployee(newEmployee);
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

    const result = await MongoDbClient.updateEmployee(
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
    const delEmployee = await MongoDbClient.deleteEmployee(employeeId);
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
