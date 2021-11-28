module.exports = {
  tickrate: 30,
  timeoutAfterMs: 1000,
  roles: {
    leftPuck: 1,
    rightPuck: 1,
  },
  inputs: [
    {
      name: "increaseVelocity",
      rolesAvailable: ["leftPuck", "rightPuck"],
      data: {
        xVel: { type: "number", validationFunction: (x, state) => {} },
        yVel: { type: "number", validationFunction: (x, state) => {} },
      },
    },
  ],
};
