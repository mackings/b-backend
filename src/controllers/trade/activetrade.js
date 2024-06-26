const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;
const crypto = require('crypto');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

const pastEvents = [];

// Define event handlers
const handlers = {
    'trade.started': handleTradeManagement,
    'trade.paid': handleTradeManagement,
    'trade.chat_message_received': handleTradeChatContent,
};

// Webhook endpoint
exports.webhook = async (req, res, next) => {
    try {
        console.log('Received a new request:');
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);

        // Send headers and body to WebSocket clients
        broadcastWebSocketMessage({
            message: 'Webhook Request Data',
            headers: req.headers,
            body: req.body
        });

        // Check for address verification request
        if (!Object.keys(req.body).length && !req.get('X-Paxful-Signature')) {
            console.log('Address verification request received.');
            const challengeHeader = 'X-Paxful-Request-Challenge';
            res.set(challengeHeader, req.get(challengeHeader));
            return res.end();
        }

        // Verify event signature
        const providedSignature = req.get('X-Paxful-Signature');
        console.log(`Provided Signature: ${providedSignature}`);

        const apiSecret = process.env.CLIENT_SECRET || 'your_actual_api_secret_here';
        const rawBody = req.rawBody;
        const calculatedSignature = crypto.createHmac('sha256', apiSecret).update(rawBody).digest('hex');
        console.log(`Calculated Signature: ${calculatedSignature}`);
        console.log(`Payload String: ${rawBody}`);

        if (!providedSignature || providedSignature !== calculatedSignature) {
            console.log('Request signature verification failed.');
            broadcastWebSocketMessage({
                message: 'Webhook Request signature verification failed',
                providedSignature,
                calculatedSignature,
                rawBody
            });

            return res.status(403).json({
                success: false,
                message: 'Request signature verification failed',
                providedSignature,
                calculatedSignature,
                rawBody
            });
        }

        // Process the event
        const event = req.body;
        console.log('New event received:');
        console.log(event.payload || event);

        broadcastWebSocketMessage({
            message: 'New event received',
            event: event.payload || event
        });

        // Add the event to past events
        pastEvents.push(event);

        // Dispatch to the appropriate handler
        const eventType = event.type;
        if (handlers[eventType]) {
            handlers[eventType](event);
        } else {
            console.warn(`No handler found for event type: ${eventType}`);
        }

        // Respond with the list of all past events, including the newly received event
        return res.status(200).json({
            success: true,
            message: 'Event received and logged successfully',
            newEvent: event,
            pastEvents: pastEvents
        });
    } catch (error) {
        console.error('Error processing webhook event:', error);
        broadcastWebSocketMessage({
            message: 'Error processing webhook event',
            error: error.message
        });

        return res.status(500).json({
            success: false,
            message: 'Error processing webhook event',
            error: error.message,
        });
    }
};

// WebSocket broadcast function
function broadcastWebSocketMessage(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Event handlers
function handleTradeChatContent(event) {
    console.log('Handling trade chat content event:');
    console.log(event);
}

function handleTradeManagement(event) {
    console.log('Handling trade management event:');
    console.log(event);
}

















exports.getActive = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const apiRoute = '/trade/get'; 
        
        const params = new URLSearchParams();
        params.append('trade_hash', req.body.trade_hash);

        const response = await axios.post(
            `${baseUrl}${apiRoute}`, 
            params.toString(), 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: req.query 
            }
        );
        console.log(response.data);
        return res.status(200).json(successResponse('Trades data retrieved successfully', response.data));
    } catch (error) {
        console.error('Error making API request:', error);
        return res.status(error.response ? error.response.status : 500).json(
            errorResponse(
                'Failed to fetch trades data',
                error.response ? error.response.status : 500,
                error
            )
        );
    }
};

exports.getBank = async (req, res) => {
    try {
        // Log the incoming request body
        console.log('Request body:', req.body);

        const accessToken = await getAccessToken();
        const apiRoute = '/trade/share-linked-bank-account'; 

        // Check if trade_hash is defined
        if (!req.body.trade_hash) {
            return res.status(400).json(errorResponse('trade_hash is required', 400));
        }

        // Create URLSearchParams with trade_hash
        const params = new URLSearchParams();
        params.append('trade_hash', req.body.trade_hash);

        const response = await axios.post(
            `${baseUrl}${apiRoute}`, 
            params.toString(), 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: req.query 
            }
        );

        console.log('Response:', response.data);
        return res.status(200).json(successResponse('Trades data retrieved successfully', response.data));
    } catch (error) {
        console.error('Error making API request:', error);
        return res.status(error.response ? error.response.status : 500).json(
            errorResponse(
                'Failed to fetch trades data',
                error.response ? error.response.status : 500,
                error
            )
        );
    }
};
