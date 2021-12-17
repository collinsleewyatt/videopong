export default {
  tickrate: 30,
  timeoutAfterMs: 1000,
  stateSaveAfterEveryMs: 50,
  ignoreUpdatesForTicksAfterEvery: 800,
  roles: {
    starship: {
      inputs: {
        "changeAcceleration": {
          "x": "number",
          "y": "number"
        },
        "changeTarget": {
          "x": "number",
          "y": "number"
        },
        "chargeLaser": {},
        "shootLaser": {}
      }
    }
  },
};
