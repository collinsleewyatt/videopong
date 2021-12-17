"use strict";
let protocol = {
  tickrate: 30,
  timeoutAfterMs: 1000,
  stateSaveAfterEveryMs: 50,
  ignoreUpdatesForTicksAfterEvery: 800,
  roles: {
    starship: {
      inputs: {
        changeAcceleration: {
          x: "number",
          y: "number",
        },
        changeTarget: {
          x: "number",
          y: "number",
        },
        chargeLaser: {},
        shootLaser: {},
      },
    },
  },
};

import { v4 } from "uuid";
import { WebSocketServer } from "ws";
const server = new WebSocketServer({ port: 7080 });
let connections = [];
let outputs = [];

function addOutput(data) {
  outputs.push(data);
  broadcastData(data);
}

function catchUpClient(ws) {
  for (let output of outputs) {
    sendData(output, ws);
  }
}

server.on("connection", (ws) => {
  connections.push(ws);
  ws.uuid = v4();
  sendData({ type: "setuuid", data: ws.uuid }, ws);
  sendData({ type: "currentTimestamp", data: Date.now() }, ws);
  catchUpClient(ws);
  // start the game:
  if (connections.length == 1) {
    addOutput({ type: "start", data: Date.now() });
    connections.forEach((client, index) => {
      addOutput({
        type: "addrole",
        role: "starship",
        uuid: ws.uuid,
      });
    });
  } else {
    addOutput({
      type: "addrole",
      role: "starship",
      uuid: ws.uuid,
    });
  }
  ws.on("message", function message(data) {
    data = JSON.parse(data);
    // a bunch of validation functions;
    if(data.data == undefined || data.type == undefined) {
      return;
    }
    if(data.type != protocol.roles.starship.inputs) {
      return;
    }
    if(!(typeof data.data == "object" && data.data != null)) {
      return;
    }
    for(let key in data.data) {
      if(protocol.roles.starship.inputs['key'] == undefined) {
        return;
      }
      if(typeof data.data[key] != protocol.roles.starship.inputs[key]) {
        return;
      }
    }
    addOutput(data);
  });

  ws.on("close", function () {
    console.log("closed");
    connections.splice(connections.indexOf(ws), 1);
    if (connections.length == 0) {
      outputs = [];
    }
  });
});

console.log("hii");

function broadcastData(data) {
  connections.forEach((ws) => {
    ws.send(JSON.stringify(data));
  });
}

function sendData(data, ws) {
  console.log(data);
  ws.send(JSON.stringify(data));
}

setInterval(() => {
  broadcastData({ type: "currentTimestamp", data: Date.now() });
}, 500);
