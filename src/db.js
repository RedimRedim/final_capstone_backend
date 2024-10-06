const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

class MongoDb {
  constructor() {
    this.client = null;
    this.employees = null;
  }

  async connectDb() {
    try {
      if (this.employees) return;

      const client = new MongoClient(process.env.MONGODB_URL);
      await client.connect();
      const database = client.db(process.env.DB_NAME);
      this.employees = database.collection("employees");
      console.log("Database has been connected");
    } catch (error) {
      console.error("Failed to connect to MongoDB server", error);
    }
  }

  async getAllEmployees({ department, sex, employeeType }) {
    console.log("Getting Employees....");
    console.log(department, sex, employeeType);
    if (department || sex || employeeType) {
      console.log("Filtering Employees....");
      return this.employees
        .find({
          department: department | "",
          sex: sex | "",
          employeeType: employeeType | "",
        })
        .toArray();
    }
    return this.employees.find().toArray();
  }

  async getEmployeeById(id) {
    console.log("Getting Employee by ID....");
    return this.employees.findOne({ _id: new ObjectId(id) });
  }

  async AddEmployee(newEmployee) {
    try {
      await this.employees.insertOne(newEmployee);
      console.log("Employee added successfully");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  MongoDb,
};
