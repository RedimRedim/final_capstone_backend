const getMonthlyDepartmentQuery = (yearMonthString) => {
  "Expecting format is 2024-05";
  const [year, month] = yearMonthString.split("-").map(Number);
  console.log(new Date(year, month, 1));
  return [
    {
      $addFields: {
        createdDate: {
          $toDate: "$createdDate",
        },
        resignDate: { $toDate: "$resignDate" },
      },
    },

    {
      $match: {
        $and: [
          {
            createdDate: {
              $lte: new Date(year, month, 1), // All records created on or before the start of the month
            },
          },
          {
            $or: [
              { resignDate: { $lte: new Date(year, month, 1) } }, // Resigned on or before the start of the month
              { resignDate: null }, // Not resigned
            ],
          },
        ],
      },
    },

    {
      $group: {
        _id: {
          // year: {
          //   $year: "$createdDate"
          // },
          // month: {
          //   $month: "$createdDate"
          // },
          department: "$department",
        },
        totalEmployees: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        // year: "$_id.year",
        // month: "$_id.month",
        department: "$_id.department",
        totalEmployees: "$totalEmployees",
      },
    },
  ];
};
module.exports = getMonthlyDepartmentQuery;
