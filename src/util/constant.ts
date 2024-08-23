
export const ROUTE = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
}

export const SLOTS_BET_MINIMUM = 0.00000001
export const GEMS_BET_MINIMUM = 0.00000100
export const MINES_BET_MINIMUM = 0.00000100
export const POKER_BET_MINIMUM = 0.00000001
export const BACCARAT_BET_MINIMUM = 0.00000001
export const HIGH_LOW_BET_MINIMUM = 0.00000100
export const WHEEL_OF_FORTUNE_BET_MINIMUM = 0.00000100
export const PLINKO_BET_MINIMUM = 0.00000100
export const LIMBO_BET_MINIMUM = 0.00000100
export const ULTIMATE_DICE_BET_MINIMUM = 0.00000001

export const SLOTS_SETTINGS = {
  tile: [
    '/slots_bell.svg', // 0
    '/slots_bnb.svg', // 1
    '/slots_cherry.svg', // 2
    '/slots_orange.svg', // 3
    '/slots_seven.svg', // 4
    '/slots_watermelon.svg', // 5
  ],
  columns: [
    [0, 0, 3, 5, 5, 3, 5, 0, 0, 1, 5, 0, 4, 0, 5, 0, 2, 2, 0, 0, 0, 0, 0, 5, 5, 2, 4, 5, 2, 0, 0, 5, 0, 2, 0, 3],
    [3, 0, 5, 0, 0, 0, 0, 0, 2, 5, 5, 0, 0, 0, 0, 0, 2, 3, 2, 5, 5, 0, 5, 5, 4, 3, 2, 1, 0, 2, 0, 2, 0, 5, 5, 4],
    [0, 0, 0, 0, 2, 4, 5, 0, 5, 0, 0, 5, 0, 0, 5, 2, 4, 2, 2, 0, 0, 5, 3, 0, 0, 5, 2, 5, 0, 1, 5, 0, 3, 0, 4, 5],
  ]
}

export const GEMS_SETTINGS = [
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

export const MINES_SETTINGS = [
  {
    mines: 1,
    gems: 24,
    multiplier: 1.01,
    multiplierPerTile: 0.01,
  }, {
    mines: 2,
    gems: 23,
    multiplier: 1.05,
    multiplierPerTile: 0.02,
  }, {
    mines: 3,
    gems: 22,
    multiplier: 1.10,
    multiplierPerTile: 0.03,
  }, {
    mines: 4,
    gems: 21,
    multiplier: 1.15,
    multiplierPerTile: 0.04,
  }, {
    mines: 5,
    gems: 20,
    multiplier: 1.21,
    multiplierPerTile: 0.05,
  }, {
    mines: 6,
    gems: 19,
    multiplier: 1.28,
    multiplierPerTile: 0.06,
  }, {
    mines: 7,
    gems: 18,
    multiplier: 1.35,
    multiplierPerTile: 0.07,
  }, {
    mines: 8,
    gems: 17,
    multiplier: 1.43,
    multiplierPerTile: 0.08,
  }, {
    mines: 9,
    gems: 16,
    multiplier: 1.52,
    multiplierPerTile: 0.09,
  }, {
    mines: 10,
    gems: 15,
    multiplier: 1.62,
    multiplierPerTile: 0.10,
  }, {
    mines: 11,
    gems: 14,
    multiplier: 1.73,
    multiplierPerTile: 0.11,
  }, {
    mines: 12,
    gems: 13,
    multiplier: 1.87,
    multiplierPerTile: 0.12,
  }, {
    mines: 13,
    gems: 12,
    multiplier: 2.02,
    multiplierPerTile: 0.13,
  }, {
    mines: 14,
    gems: 11,
    multiplier: 2.20,
    multiplierPerTile: 0.14,
  }, {
    mines: 15,
    gems: 10,
    multiplier: 2.42,
    multiplierPerTile: 0.15,
  }, {
    mines: 16,
    gems: 9,
    multiplier: 2.69,
    multiplierPerTile: 0.16,
  }, {
    mines: 17,
    gems: 8,
    multiplier: 3.03,
    multiplierPerTile: 0.17,
  }, {
    mines: 18,
    gems: 7,
    multiplier: 3.46,
    multiplierPerTile: 0.18,
  }, {
    mines: 19,
    gems: 6,
    multiplier: 4.04,
    multiplierPerTile: 0.19,
  }, {
    mines: 20,
    gems: 5,
    multiplier: 4.85,
    multiplierPerTile: 0.20,
  }, {
    mines: 21,
    gems: 4,
    multiplier: 6.06,
    multiplierPerTile: 0.21,
  }, {
    mines: 22,
    gems: 3,
    multiplier: 8.08,
    multiplierPerTile: 0.22,
  }, {
    mines: 23,
    gems: 2,
    multiplier: 12.13,
    multiplierPerTile: 0.23,
  }, {
    mines: 24,
    gems: 1,
    multiplier: 24.25,
    multiplierPerTile: 0.24,
  },
]

export const CARD_GAMES_SETTINGS = {
  deck: [
    { suit: 'hearts', rank: '2' },
    { suit: 'hearts', rank: '3' },
    { suit: 'hearts', rank: '4' },
    { suit: 'hearts', rank: '5' },
    { suit: 'hearts', rank: '6' },
    { suit: 'hearts', rank: '7' },
    { suit: 'hearts', rank: '8' },
    { suit: 'hearts', rank: '9' },
    { suit: 'hearts', rank: '10' },
    { suit: 'hearts', rank: 'J' },
    { suit: 'hearts', rank: 'Q' },
    { suit: 'hearts', rank: 'K' },
    { suit: 'hearts', rank: 'A' },
    { suit: 'diamonds', rank: '2' },
    { suit: 'diamonds', rank: '3' },
    { suit: 'diamonds', rank: '4' },
    { suit: 'diamonds', rank: '5' },
    { suit: 'diamonds', rank: '6' },
    { suit: 'diamonds', rank: '7' },
    { suit: 'diamonds', rank: '8' },
    { suit: 'diamonds', rank: '9' },
    { suit: 'diamonds', rank: '10' },
    { suit: 'diamonds', rank: 'J' },
    { suit: 'diamonds', rank: 'Q' },
    { suit: 'diamonds', rank: 'K' },
    { suit: 'diamonds', rank: 'A' },
    { suit: 'clubs', rank: '2' },
    { suit: 'clubs', rank: '3' },
    { suit: 'clubs', rank: '4' },
    { suit: 'clubs', rank: '5' },
    { suit: 'clubs', rank: '6' },
    { suit: 'clubs', rank: '7' },
    { suit: 'clubs', rank: '8' },
    { suit: 'clubs', rank: '9' },
    { suit: 'clubs', rank: '10' },
    { suit: 'clubs', rank: 'J' },
    { suit: 'clubs', rank: 'Q' },
    { suit: 'clubs', rank: 'K' },
    { suit: 'clubs', rank: 'A' },
    { suit: 'spades', rank: '2' },
    { suit: 'spades', rank: '3' },
    { suit: 'spades', rank: '4' },
    { suit: 'spades', rank: '5' },
    { suit: 'spades', rank: '6' },
    { suit: 'spades', rank: '7' },
    { suit: 'spades', rank: '8' },
    { suit: 'spades', rank: '9' },
    { suit: 'spades', rank: '10' },
    { suit: 'spades', rank: 'J' },
    { suit: 'spades', rank: 'Q' },
    { suit: 'spades', rank: 'K' },
    { suit: 'spades', rank: 'A' }
  ],
  hands: [
    {
      name: 'ROYAL FLUSH',
      multiplier: 800
    },
    {
      name: 'STRAIGHT FLUSH',
      multiplier: 60
    },
    {
      name: '4 OF A KIND',
      multiplier: 22
    },
    {
      name: 'FULL HOUSE',
      multiplier: 9
    },
    {
      name: 'FLUSH',
      multiplier: 6
    },
    {
      name: 'STRAIGHT',
      multiplier: 4
    },
    {
      name: '3 OF A KIND',
      multiplier: 3
    },
    {
      name: '2 PAIR',
      multiplier: 2
    },
    {
      name: 'PAIR OF JACK OR BETTER',
      multiplier: 1
    }
  ],
}

export const HIGH_LOW_SETTINGS = {
  multiplier: [1.05, 1.05, 1.15, 1.26, 1.40, 1.58, 1.80, 2.10, 2.52, 3.15, 4.20, 6.31, 12.61]
}

export const ROULETTE_SETTINGS = {
  chips: [
    {
      value: 100,
      img: '/roulette_100.png'
    }, {
      value: 1000,
      img: '/roulette_1000.png'
    }, {
      value: 10000,
      img: '/roulette_10000.png'
    }, {
      value: 100000,
      img: '/roulette_100000.png'
    }, {
      value: 1000000,
      img: '/roulette_1000000.png'
    }, {
      value: 10000000,
      img: '/roulette_10000000.png'
    }, {
      value: 100000000,
      img: '/roulette_100000000.png'
    }
  ],
  wheelValues: [
    '0',
    '00',
    ...Array.from({ length: 36 }, (_, i) => `${i + 1}`),
  ],
  tile: {
    red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
  }
}

export const WHEEL_OF_FORTUNE_SETTINGS = [
  { position: 0, multiplier: 3 },
  { position: 30, multiplier: 0 },
  { position: 60, multiplier: 1.5 },
  { position: 90, multiplier: 0 },
  { position: 120, multiplier: 2.5 },
  { position: 150, multiplier: 0 },
  { position: 180, multiplier: 1 },
  { position: 210, multiplier: 0 },
  { position: 240, multiplier: 2 },
  { position: 270, multiplier: 0 },
  { position: 300, multiplier: 1.5 },
  { position: 330, multiplier: 0 },
  { position: 360, multiplier: 3 }
]

export const PLINKO_SETTINGS = {
  rows: 10,
  risk: [
    {
      value: 'low',
      label: 'Low',
      multiplier: [0.5, 1, 1.1, 1.3, 2.4, 9]
    },
    {
      value: 'medium',
      label: 'Medium',
      multiplier: [0.4, 0.6, 1.2, 2, 5, 36]
    },
    {
      value: 'high',
      label: 'High',
      multiplier: [0.15, 0.4, 0.7, 3, 10, 75]
    },
  ]
}

export const LIMBO_SETTINGS = {
  xMax: 970.00,
  xMin: 1.01
}