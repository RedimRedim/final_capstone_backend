const queryMonthlySalary = [
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year",
      },
      totalSalary: { $sum: "$totalReleasedSalary" },
    },
  },

  {
    $project: {
      year: "$_id.year",
      month: "$_id.month",
      totalSalary: "$totalSalary",
      _id: 0,
    },
  },
];

module.exports = queryMonthlySalary;
