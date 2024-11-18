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
    $addFields: {
      resignRatioRate: {
        $cond: [
          { $eq: ["$totalEmployeesReleased", 0] },
          0,
          {
            $divide: ["$totalResign", "$totalEmployeesReleased"],
          },
        ],
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
      resignRatioRate: "$resignRatioRate",
      _id: 0,
    },
  },
];

module.exports = queryMonthlySalary;
