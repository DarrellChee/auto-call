# Auto Call Prototype

This repository provides a minimal Node.js + React setup for placing automated phone calls and streaming real-time updates to a web UI.

## Features

1. Install dependencies for both server and client
npm run install-all
2. Create a `.env` file in the repository root with your configuration:
3. Start the dev servers

This launches the API server on `http://localhost:3001` and a static web
server on `http://localhost:3000`.

Then open `http://localhost:3000` in your browser.

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
