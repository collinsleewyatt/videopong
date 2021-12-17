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
        type: "input",
        data: {
          data: {
            uuid: client.uuid,
            location: {
              x: 100,
              y: 100,
            },
          },
          index: outputs.length,
          onTick: 1,
          type: "addCharacter",
        },
      });
    });
  }else {
    addOutput({
      type: "input",
      data: {
        data: {
          uuid: ws.uuid,
          location: {
            x: 100,
            y: 100,
          },
        },
        index: outputs.length,
        onTick: 1,
        type: "addCharacter",
      },
    });
  }

  ws.on("message", function message(data) {
    data = JSON.parse(data);
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
