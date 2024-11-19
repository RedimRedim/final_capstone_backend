const getMonthlyDepartmentQuery = [
  {
    $group: {
      _id: {
        month: "$month",
        year: "$year",
        department: "$department",
      },
      lateMinutes: { $sum: "$late" },
      absentDays: { $sum: "$absent" },
      lateDeduction: { $sum: "$lateDeduction" },
      absentDeduction: {
        $sum: "$absentDeduction",
      },
      totalEmployeesReleased: { $sum: 1 },
      totalResign: { $sum: { $cond: [{ $eq: ["$isResign", true] }, 1, 0] } },
    },
  },

  {
    $addFields: {
      resignRatioRate: {
        $cond: [
          { $eq: ["$totalEmployeesReleased", 0] },
          0,
          { $divide: ["$totalResign", "$totalEmployeesReleased"] },
        ],
      },
    },
  },

  {
    $project: {
      month: "$_id.month",
      year: "$_id.year",
      department: "$_id.department",
      totalEmployees: "$totalEmployeesReleased",
      totalResign: "$totalResign",
      resignRatioRate: "$resignRatioRate",
      lateMinutes: "$lateMinutes",
      absentDays: "$absentDays",
      lateDeduction: "$lateDeduction",
      absentDeduction: "$absentDeduction",
      _id: 0,
    },
  },
];

module.exports = getMonthlyDepartmentQuery;
