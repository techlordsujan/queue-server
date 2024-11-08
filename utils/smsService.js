// smsUtils.js
const twilio = require("twilio");
require("dotenv").config();
// Replace these values with your Twilio credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create a Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send SMS using Twilio
 * @param {string} to - The recipient's phone number (including country code)
 * @param {string} from - The sender's phone number (Twilio number)
 * @param {string} body - The message body
 * @returns {Promise<object>} - The result of the message sending attempt
 */
async function sendSMS(to, fromNumber, body) {
  try {
    const message = await client.messages.create({
      to,
      from: fromNumber,
      body,
    });
    console.log("Message sent:", message.sid);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error };
  }
}

module.exports = sendSMS;
