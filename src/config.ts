export const dueDateValue = [3, 6, 12];

export const defaultPercent = {
  percentHigh: 0,
  percentMid: 0,
  percentLow: 0,
};

export const defaultPrice = {
  highManPrice: 0,
  highManCount: 0,
  midManPrice: 0,
  midManCount: 0,
  lowManPrice: 0,
  lowManCount: 0,
};

export const exampleManagementChildren = {
  example: {
    seqNo: "6ab245ff-db88-419a-ad9e-96d95b825ec9",
    name: "dummy",
    order: 0,
    isHidden: false,
    price: [
      {
        month: 3,
        precent: [
          {
            month: 1,
            percentLow: 60,
            percentMid: 60,
            percentHigh: 0,
          },
          {
            month: 2,
            percentLow: 0,
            percentMid: 0,
            percentHigh: 0,
          },
          {
            month: 3,
            percentLow: 0,
            percentMid: 0,
            percentHigh: 0,
          },
        ],
        lowManCount: 0,
        lowManPrice: 0,
        midManCount: 0,
        midManPrice: 0,
        highManCount: 0,
        highManPrice: 0,
      },
    ],
  },
};

export const parentData = [
  { name: "UI/UX 전략", order: 0 },
  { name: "GUI 디자인", order: 1 },
  { name: "모션", order: 2 },
  { name: "프로토타입", order: 3 },
  { name: "개발", order: 4 },
];
