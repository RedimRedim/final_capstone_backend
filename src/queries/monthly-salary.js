const queryMonthlySalary = [
  {
    $unwind:
       {
        path: "$salary",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $group:
         {
        _id: {
          year: "$salary.year",
          month: "$salary.month"
        },
        totalSalary: {
          $sum: "$salary.amount"
        },
        totalEmployees: {
          $sum: 1,
        },
        totalMale: {
          $sum: {"$cond" : [{"$eq": ["$sex", "Male"]},1,0]}
        },
       totalFemale: {
          $sum: {"$cond" : [{"$eq": ["$sex", "Female"]},1,0]}
        },
      totalRegular: {
          $sum: {"$cond" : [{"$eq": ["$employeeType", "Regular"]},1,0]}
        },
      totalProbation: {
          $sum: {"$cond" : [{"$eq": ["$employeeType", "Probation"]},1,0]}
        }
      }
  },
  {
    $project:
      {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalSalary: "$totalSalary",
        totalEmployees: "$totalEmployees",
        totalMale: "$totalMale",
        totalFemale: "$totalFemale",
        totalRegular: "$totalRegular",
        totalProbation: "$totalProbation"
      }
  },
  {
    $sort:
      {
        year: 1,
        month: 1
      }
  }
]

module.exports =  queryMonthlySalary