const latestIdQuery = [
  {
    $project: {
      modified_uuid: {
        $replaceAll: {
          input: "$uuid",
          find: "ID",
          replacement: "",
        },
      },
    },
  },
  {
    $addFields: {
      modified_uuid_int: {
        $toInt: {
          $cond: {
            if: {
              $regexMatch: {
                input: "$modified_uuid",
                regex: /^\d+$/,
              },
            },
            then: "$modified_uuid",
            else: null,
          },
        },
      },
    },
  },
  {
    $sort: { modified_uuid_int: -1 },
  },

  { $limit: 1 },
];
module.exports = latestIdQuery;
