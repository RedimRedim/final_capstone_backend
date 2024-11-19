const queryMonthlySalary = [
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year",
      },
      totalSalary: {
        $sum: "$totalReleasedSalary",
      },
      totalEmployeesReleased: { $sum: 1 },
      totalResign: {
        $sum: {
          $cond: [{ $eq: ["$isResign", true] }, 1, 0],
        },
      },
    },
  },

  {
    $project: {
      year: "$_id.year",
      month: "$_id.month",
      totalSalary: "$totalSalary",
      totalEmployeesReleased: "$totalEmployeesReleased",
      totalResign: "$totalResign",
      _id: 0,
    },
  },
];

module.exports = queryMonthlySalary;
