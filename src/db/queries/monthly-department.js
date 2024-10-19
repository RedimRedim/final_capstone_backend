const queryMonthlyDepartment = [
  {
    $addFields: {
      createdDate: {
        $toDate: "$createdDate",
      },
    },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: {
          year: {
            $year: "$createdDate",
          },
          month: {
            $month: "$createdDate",
          },
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
      year: "$_id.year",
      month: "$_id.month",
      department: "$_id.department",
      totalEmployees: "$totalEmployees",
    },
  },

  {
    $sort: {
      year: 1,
      month: 1,
    },
  },
];

module.exports = queryMonthlyDepartment;
