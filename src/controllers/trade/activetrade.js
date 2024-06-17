const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;
const crypto = require('crypto');
let pastEvents = []; 

const apiSecret = 'U9PFVxPXZ7pkJPovBtLyhNVbhaZDreNGeEY6b0FAwVKsifpf';

async function fetchEventData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error.message);
        throw error;
    }
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


exports.webhook = async (req, res) => {
    try {
        console.log('Received a new request:');
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);

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
        const calculatedSignature = crypto.createHmac('sha256', apiSecret).update(JSON.stringify(req.body)).digest('hex');
        console.log(`Calculated Signature: ${calculatedSignature}`);
        if (providedSignature !== calculatedSignature) {
            console.log('Request signature verification failed.');
            return res.status(403).end();
        }

        // Process the event
        console.log('New event received:');
        console.log(req.body);

        // Fetch additional event data from the specified URL
        const eventUrl = 'https://b-backend-xe8q.onrender.com/webhook';  // The URL to fetch additional data from
        const additionalEventData = await fetchEventData(eventUrl);
        console.log('Fetched additional event data:');
        console.log(additionalEventData);

        // Add the event to past events
        pastEvents.push({
            receivedEvent: req.body,
            additionalEventData: additionalEventData
        });

        // Respond with the list of all past events and the fetched data
        return res.status(200).json({
            success: true,
            message: 'Event received and logged successfully',
            pastEvents: pastEvents
        });
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing webhook event',
            error: error.message,
        });
    }
};