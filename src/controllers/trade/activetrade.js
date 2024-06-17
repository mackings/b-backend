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





async function fetchEventData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error.message);
        throw error;
    }
}


async function fetchEventData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching event data:', error.message);
        throw error;
    }
}

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
        const event = req.body;
        console.log('New event received:');
        console.log(event);

        // Handle different event types
        switch (event.type) {
            case 'profile.viewed':
                handleProfileViewed(event);
                break;
            case 'trade.chat_message_received':
            case 'trade.attachment_uploaded':
            case 'trade.bank_account_shared':
            case 'trade.online_wallet_shared':
            case 'trade.bank_account_selected':
            case 'trade.proof_added':
                handleTradeChatContent(event);
                break;
            case 'crypto.deposit_confirmed':
            case 'crypto.deposit_pending':
                handleWalletInfo(event);
                break;
            case 'feedback.received':
            case 'feedback.reply_received':
                handleFeedback(event);
                break;
            case 'trade.started':
            case 'trade.paid':
            case 'trade.cancelled_or_expired':
            case 'trade.released':
            case 'trade.dispute_started':
            case 'trade.dispute_finished':
                handleTradeManagement(event);
                break;
            case 'invoice.paid':
            case 'invoice.canceled':
                handleMerchantInvoice(event);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Add the event to past events
        pastEvents.push(event);

        // Respond with the list of all past events
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

function handleProfileViewed(event) {
    console.log('Handling profile viewed event:');
    console.log(event);
}

function handleTradeChatContent(event) {
    console.log('Handling trade chat content event:');
    console.log(event);
}

function handleWalletInfo(event) {
    console.log('Handling wallet info event:');
    console.log(event);
}

function handleFeedback(event) {
    console.log('Handling feedback event:');
    console.log(event);
}

function handleTradeManagement(event) {
    console.log('Handling trade management event:');
    console.log(event);
}

function handleMerchantInvoice(event) {
    console.log('Handling merchant invoice event:');
    console.log(event);
}
