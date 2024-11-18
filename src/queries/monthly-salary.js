const queryMonthlySalary = [
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year",
      },
      totalSalary: { $sum: "$totalReleasedSalary" },
      totalEmployeesReleased: { $sum: 1 },
    },
  },

  {
    $project: {
      year: "$_id.year",
      month: "$_id.month",
      totalSalary: "$totalSalary",
      totalEmployeesReleased: "$totalEmployeesReleased",
      _id: 0,
    },
  },
];

module.exports = queryMonthlySalary;
