const queryMonthlySalary = require("./queries/monthly-salary");
const getMonthlyDepartmentQuery = require("./queries/monthly-department");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

class MongoDb {
  constructor() {
    this.client = null;
    this.employees = null;
    this.connected = false;
  }

  async connectDb() {
    if (this.connected) return;

    try {
      this.client = new MongoClient(process.env.MONGODB_URLCLOUD, {
        serverSelectionTimeoutMS: 3000,
      });

      await this.client.connect();
      this.connected = true;
      console.log("Cloud DB has been connected");
    } catch (error) {
      console.log("Failed to connect Cloud MongoDB, trying local MongoDB");

      try {
        this.client = new MongoClient(process.env.MONGODB_URL); //LOCAL
        await this.client.connect();
        this.connected = true;
        console.log("Local DB has been connected");
      } catch (error) {
        console.log("Failed to connect Local MongoDB");
      }
    }

    const database = this.client.db(process.env.DB_NAME);
    this.employees = database.collection("employees");
  }

  async getAllEmployees({ department, sex, employeeType }) {
    console.log("Getting Employees....");
    console.log(department, sex, employeeType);

    if (department || sex || employeeType) {
      const query = {
        $and: [
          department
            ? { department: { $regex: new RegExp(department, "i") } }
            : {},
          sex ? { sex: { $regex: new RegExp(sex, "i") } } : {},
          employeeType
            ? { employeeType: { $regex: new RegExp(employeeType, "i") } }
            : {},
        ],
      };
      console.log("Filtering Employees....");
      return this.employees.find(query).toArray();
    }
    return this.employees.find().toArray();
  }

  async getEmployeeById(id) {
    console.log("Getting Employee by ID....");
    return await this.employees.findOne({ _id: new ObjectId(id) });
  }

  async insertEmployee(newEmployee) {
    try {
      console.log(newEmployee);
      await this.employees.insertOne(newEmployee);
      console.log("Employee added successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteEmployee(employeeId) {
    try {
      console.log(employeeId);
      const data = await this.employees.deleteOne({
        _id: new ObjectId(employeeId),
      });
      return data.deletedCount == 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateEmployee(employeeId, updatedEmployee) {
    try {
      const data = await this.employees.updateOne(
        { _id: new ObjectId(employeeId) },
        { $set: updatedEmployee }
      );
      return data.modifiedCount == 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getMonthlySalary() {
    try {
      await this.connectDb(); // Ensure the DB connection is established
      if (this.connected) {
        const result = await this.employees
          .aggregate(queryMonthlySalary)
          .toArray();

        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getMonthlyDepartment(date) {
    try {
      await this.connectDb();
      if (this.connected) {
        const queryMonthlyDepartment = getMonthlyDepartmentQuery(date);

        const result = await this.employees
          .aggregate(queryMonthlyDepartment)
          .toArray();

        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = {
  MongoDb,
};
