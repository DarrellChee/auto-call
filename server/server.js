const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const telephony = require('./telephony');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.json());
app.use(cors());

io.on('connection', socket => {
  console.log('WebSocket client connected');
});

app.post('/start-call', async (req, res) => {
  const { phoneNumber, topic, userName } = req.body || {};
  if (!phoneNumber || !topic || !userName) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    await telephony.startCall({ phoneNumber, topic, userName, io });
    res.json({ status: 'started' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start call' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
