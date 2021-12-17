import express from 'express'; 
import server from './index.js';

const app = express();

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
app.use(express.static('dist'))
const exp = app.listen(8080);
exp.on('upgrade', (request, socket, head) => {
  server.handleUpgrade(request, socket, head, socket => {
    server.emit('connection', socket, request);
  });
});

