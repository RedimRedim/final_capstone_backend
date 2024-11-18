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
    },
  },
  {
    $project: {
      month: "$_id.month",
      year: "$_id.year",
      department: "$_id.department",
      lateMinutes: "$lateMinutes",
      absentDays: "$absentDays",
      lateDeduction: "$lateDeduction",
      absentDeduction: "$absentDeduction",
      _id: 0,
    },
  },
];

module.exports = getMonthlyDepartmentQuery;
