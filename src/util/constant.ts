
export const ROUTE = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
}

export const GEMS_BET_MINIMUM = 0.00000100

export const GEMS_PROFITS = [
  {
    name: "Easy",
    column: 3,
    gems: 2,
    multiplier: [1.46, 2.12, 3.08, 4.48, 6.52, 9.49, 13.81, 20.09, 29.23, 42.53]
  }, {
    name: "Medium",
    column: 2,
    gems: 1,
    multiplier: [1.94, 3.76, 7.29, 14.14, 27.43, 53.21, 103.23, 200.27, 388.52, 753.73]
  }, {
    name: "Hard",
    column: 3,
    gems: 1,
    multiplier: [2.91, 8.47, 24.65, 71.73, 208.73, 607.40, 1767.53, 5143.51, 14967.61, 43555.75]
  }
]