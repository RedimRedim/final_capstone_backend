const dotenv = require("dotenv");
const path = require("path");
const queryMonthlySalary = require("../queries/monthly-salary");
dotenv.config({ path: path.resolve(__dirname, "../config/.env") });

class MongoDbSalary {
  constructor(MongoDbInstance) {
    this.MongoDbInstance = MongoDbInstance;
    this.collection;
    this.initDb();
  }

  async initDb() {
    this.collection = await this.MongoDbInstance.getCollection(
      process.env.COLLECTION_SALARY_NAME
    );
  }

  async getMonthlySalaryEmployees() {
    try {
      const result = await this.collection
        .aggregate(queryMonthlySalary)
        .toArray();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getMonthlySalary({ year, month }) {
    let query = {};

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    return await this.collection
      .find(query, { projection: { _id: 0 } })
      .toArray();
  }
}

module.exports = {
  MongoDbSalary,
};
