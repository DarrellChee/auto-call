# Auto Call Prototype

This repository provides a minimal Node.js + React setup for placing automated phone calls and streaming real-time updates to a web UI.

## Features

* **Express.js** server with a `/start-call` endpoint.
* **Socket.io** for pushing call status and transcripts to the browser.
* **Twilio** integration for outbound calls (media handling stubbed).
* Lightweight React front end that connects via WebSocket.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file with your configuration:

```bash
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_NUMBER=your_twilio_number
PUBLIC_URL=http://localhost:3001
```

3. Start the server

```bash
npm start
```

Then open `http://localhost:3001` in your browser.

Use the form on the page to enter a phone number, a short topic, and your name.
Click **Start Call** and the server will place the call immediately. Call status and live transcript lines will appear below the form. A simple call history list shows past conversations.
