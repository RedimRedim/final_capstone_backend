const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

class MongoDb {
  constructor() {
    this.client = null;
    this.employees = null;
  }

  async connectDb() {
    let client;

    try {
      client = new MongoClient(process.env.MONGODB_URLCLOUD);
      console.log("Cloud DB has been connected");

      await client.connect();
    } catch (error) {
      console.log("Failed to connect Cloud MongoDB, trying local MongoDB");

      try {
        client = new MongoClient(process.env.MONGODB_URL); //LOCAL
        await client.connect();
        console.log("Local DB has been connected");
      } catch (error) {
        console.log("Failed to connect Local MongoDB");
      }
    }

    const database = client.db(process.env.DB_NAME);
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
      // const result = await this.employees
      //   .aggregate([
      //     {
      //       $addFields: {
      //         createdDate: { $toDate: "$createdDate" },
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: {
      //           year: { $year: "$createdDate" },
      //           month: {
      //             $dateToString: { format: "%b", date: "$createdDate" },
      //           },
      //           department: "$department",
      //           salary: {
      //             $sum: {
      //               $sum: {
      //                 $map: {
      //                   input: { $objectToArray: "$salary" },
      //                   as: "s",
      //                   in: "$$s.v",
      //                 },
      //               },
      //             },
      //           },
      //           totalEmployees: { $sum: 1 },
      //           totalMale: {
      //             $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
      //           },
      //           totalFemale: {
      //             $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
      //           },
      //           totalRegular: {
      //             $sum: {
      //               $cond: [{ $eq: ["$employeeType", "Regular"] }, 1, 0],
      //             },
      //           },
      //           totalProbation: {
      //             $sum: {
      //               $cond: [{ $eq: ["$employeeType", "Probation"] }, 1, 0],
      //             },
      //           },
      //           department: { $addToSet: "$department" },
      //         },
      //         count: { $sum: 1 },
      //       },
      //     },
      //     {
      //       $project: {
      //         year: "$_id.year",
      //         month: "$_id.month",
      //         totalEmployees: "$totalEmployees",
      //         totalMale: "$totalMale",
      //         totalFemale: "$totalFemale",
      //         totalProbation: "$totalProbation",
      //         totalRegular: "$totalRegular",
      //         department: "$_id.department",
      //         _id: 0,
      //       },
      //     },
      //     { $sort: { year: 1, month: 1 } },
      //   ])
      //   .toArray();
      const result = "asd";
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = {
  MongoDb,
};
