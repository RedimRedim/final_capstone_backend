const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

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
          .aggregate([
            {
              $addFields: {
                createdDate: {
                  $dateFromString: { dateString: "$createdDate" },
                },
              },
            },
            {
              $addFields: {
                year: {
                  $year: "$createdDate",
                },
                month: {
                  $month: "$createdDate",
                },
              },
            },

            {
              $group: {
                _id: { year: "$year", month: "$month" },
                // totalSalary: { $sum: "$salary" },
                totalEmployees: { $sum: 1 },
                //totalSalary: { $sum: { $toInt: "$salary.v" } },
                totalMale: {
                  $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
                },
                totalFemale: {
                  $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
                },
                totalRegular: {
                  $sum: {
                    $cond: [{ $eq: ["$employeeType", "Regular"] }, 1, 0],
                  },
                },
                totalProbation: {
                  $sum: {
                    $cond: [{ $eq: ["$employeeType", "Probation"] }, 1, 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                // totalSalary: 1,
                totalEmployees: 1,
                totalMale: 1,
                totalFemale: 1,
                totalRegular: 1,
                totalProbation: 1,
              },
            },
          ])
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
