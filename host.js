import express from 'express'; 
import server from './index.js';
import fs from "node:fs";
import crypto from "node:crypto";
import bodyParser from "body-parser";

// key is the base64 of the sha256 hash of the key
const keyHash = fs.readFileSync(".update_key").toString()
const app = express();

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
app.use(express.static('dist'))
app.use(bodyParser.urlencoded({ extended: true }));

// Update manager
app.post("/update", (req, res) => {
  let submittedKey = req.body["key"]
  if(submittedKey == undefined) {
    res.status(400).send("You need a key parameter URL encoded.");
    return;
  }else if(typeof submittedKey == "string" && submittedKey.length <= 300){
    let submittedKeyHash = crypto.createHash('sha256').update(submittedKey).digest('base64');
    if(submittedKeyHash == keyHash) {
      res.status(200).send("Ok! Updating");
      process.exit(0);
    }else {
      res.status(400).send("Wrong key.");
      return;
    }
  }
});
const exp = app.listen(8080);
exp.on('upgrade', (request, socket, head) => {
  server.handleUpgrade(request, socket, head, socket => {
    server.emit('connection', socket, request);
  });
});

