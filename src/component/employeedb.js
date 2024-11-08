const MonthlySalaryQuery = require("../queries/monthly-salary");
const getMonthlyDepartmentQuery = require("../queries/monthly-department");
const latestIdQuery = require("../queries/latest-id");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

class MongoDbEmployees {
  constructor(MongoDbInstance) {
    this.MongoDbInstance = MongoDbInstance;
    this.initDb();
  }

  async initDb() {
    this.collection = await this.MongoDbInstance.getCollection(
      process.env.COLLECTION_EMPLOYEES_NAME
    );
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
      return this.collection.find(query, { projection: { _id: 0 } }).toArray();
    }
    return this.collection.find({}, { projection: { _id: 0 } }).toArray();
  }

  async getEmployeeById(id) {
    console.log("Getting Employee by ID....");
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async insertEmployee(newEmployee) {
    try {
      console.log(newEmployee);
      await this.collection.insertOne(newEmployee);
      console.log("Employee added successfully");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteEmployee(employeeId) {
    try {
      console.log(employeeId);
      const data = await this.collection.deleteOne({
        uuid: employeeId,
      });
      return data.deletedCount == 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateEmployee(employeeId, updatedEmployee) {
    console.log(employeeId);
    try {
      const data = await this.collection.updateOne(
        { uuid: employeeId },
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
      const result = await this.collection
        .aggregate(MonthlySalaryQuery)
        .toArray();

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getMonthlyDepartment(date) {
    try {
      const queryMonthlyDepartment = getMonthlyDepartmentQuery(date);

      const result = await this.collection
        .aggregate(queryMonthlyDepartment)
        .toArray();

      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addSampleEmployeeData(jsondata) {
    try {
      await this.collection.deleteMany({});
      await this.collection.insertMany(jsondata);
      console.log("Sample employee data added successfully");
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getLatestId() {
    try {
      const latestId = await this.collection.aggregate(latestIdQuery).toArray();

      console.log(latestId);
      return latestId[0].modified_uuid_int;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = {
  MongoDbEmployees,
};
