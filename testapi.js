const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

//Middleware to parse JSON Bodies
app.use(bodyParser.json());

app.get("/employees", (req, res) => {
  res.status(200).send("Hello world");
});

//adding newEmployee POST request
app.post("/employees", (req, res) => {
  let newEmployee = req.body;
  console.log(newEmployee);
  if (!newEmployee.name && !newEmployee.department & !newEmployee.sex) {
    res.status(400).json({ message: "Missing required fields" });
  }

  res.status(201).send(newEmployee);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const testEmployee = {
//   uuid: "123123",
//   name: "John Doe",
//   sex: "Male",
//   department: "Sales",
//   employeeType: "Regular",
//   salary: { Jan: 50000, Feb: 35000, Mar: 55000 },
//   isResign: false,
// };
