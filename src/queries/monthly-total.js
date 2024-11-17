const queryMonthlyTotalEmployees = [
  {
    $addFields: {
      createdDate: { $toDate: "$createdDate" },
    },
  },

  {
    $project: {
      month: { $month: "$createdDate" },
      year: { $year: "$createdDate" },
      sex: "$sex",
      employeeType: "$employeeType",
    },
  },

  {
    $group: {
      _id: { year: "$year", month: "$month" },
      totalEmployees: { $sum: 1 },
      totalMale: { $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] } },
      totalFemale: { $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] } },
      totalRegular: {
        $sum: { $cond: [{ $eq: ["$employeeType", "Regular"] }, 1, 0] },
      },
      totalProbation: {
        $sum: { $cond: [{ $eq: ["$employeeType", "Probation"] }, 1, 0] },
      },
    },
  },

  {
    $project: {
      year: "$_id.year",
      month: "$_id.month",
      totalEmployees: "$totalEmployees",
      totalMale: "$totalMale",
      totalRegular: "$totalRegular",
      totalProbation: "$totalProbation",
      _id: 0,
    },
  },
];

module.exports = queryMonthlyTotalEmployees;
