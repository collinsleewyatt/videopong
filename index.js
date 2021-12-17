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
const server = new WebSocketServer({ noServer: true});
let connections = [];
let outputs = [];

let startTime = -1;

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
    if(startTime == -1) {
      startTime = Date.now();
    }
      addOutput({ type: "start", data: Date.now() });
    connections.forEach((client, index) => {
      addOutput({
        type: "addrole",
        role: "starship",
        uuid: ws.uuid,
        onTick: Math.floor((Date.now() - startTime) / 30) + 1
      });
    });
  } else {
    addOutput({
      type: "addrole",
      role: "starship",
      uuid: ws.uuid,
      onTick: Math.floor((Date.now() - startTime) / 30) + 1
    });
  }
  ws.on("message", function message(data) {
    data = JSON.parse(data);
    // a bunch of validation functions;
    if (data.data == undefined || data.type == undefined || typeof data.type != "string") {
      console.log("1", data)
      return;
    }
    if (protocol.roles.starship.inputs[data.type] == undefined) {
      console.log('2')
      return;
    }
    if (!(typeof data.data == "object" && data.data != null)) {
      console.log(3)
      return;
    }
    for (let key in data.data) {
      /*if(protocol.roles.starship.inputs[key] == undefined) {
        console.log(4)
        return;
      }*//*
      if(typeof data.data[key] != protocol.roles.starship.inputs[key]) {
        console.log(5)
        return;
      }*/
    }
    addOutput({
      type: "input",
      data: {
        data: data.data,
        index: outputs.length,
        onTick: data.onTick,
        type: data.type,
        uuid: ws.uuid
      }
    });
  });

  ws.on("close", function () {
    console.log("closed");
    connections.splice(connections.indexOf(ws), 1);
    if (connections.length == 0) {
      outputs = [];
    }
    addOutput({
      type: "removerole",
      role: "starship",
      uuid: ws.uuid,
      onTick: Math.floor((Date.now() - startTime) / 30)
    });
    if(connections.length == 0) {
      startTime = -1;
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
export default server;