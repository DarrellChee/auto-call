const path = require('path');
const twilio = require('twilio');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

async function startCall({ phoneNumber, topic, userName, io }) {
  if (!accountSid || !authToken || !twilioNumber) {
    throw new Error('Twilio credentials not configured');
  }

  io.emit('call-status', { status: 'calling' });

  const call = await client.calls.create({
    twiml: `<Response><Say voice="alice">Connecting you now</Say></Response>`,
    to: phoneNumber,
    from: twilioNumber,
    statusCallback: process.env.PUBLIC_URL + '/twilio-events',
    statusCallbackEvent: ['ringing', 'answered', 'completed']
  });

  console.log('Call initiated', call.sid);
  // Further media stream handling would go here.
}

module.exports = {
  startCall
};
