const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;
const crypto = require('crypto');



const pastEvents = [];
const handlers = {
    'profile.viewed': handleProfileViewed,
    'trade.chat_message_received': handleTradeChatContent,
    'trade.attachment_uploaded': handleTradeChatContent,
    'trade.bank_account_shared': handleTradeChatContent,
    'trade.online_wallet_shared': handleTradeChatContent,
    'trade.bank_account_selected': handleTradeChatContent,
    'trade.proof_added': handleTradeChatContent,
    'crypto.deposit_confirmed': handleWalletInfo,
    'crypto.deposit_pending': handleWalletInfo,
    'feedback.received': handleFeedback,
    'feedback.reply_received': handleFeedback,
    'trade.started': handleTradeManagement,
    'trade.paid': handleTradeManagement,
    'trade.cancelled_or_expired': handleTradeManagement,
    'trade.released': handleTradeManagement,
    'trade.dispute_started': handleTradeManagement,
    'trade.dispute_finished': handleTradeManagement,
    'invoice.paid': handleMerchantInvoice,
    'invoice.canceled': handleMerchantInvoice,
    'trade.chat.message': handleTradeChatMessage,
};

exports.webhook = async (req, res) => {
    try {
        console.log('Received a new request:');
        console.log(`Headers: ${JSON.stringify(req.headers)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`); // Log the full request body

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

        // Ensure CLIENT_SECRET or apiSecret is correctly set
        const apiSecret = process.env.CLIENT_SECRET || 'your_actual_api_secret_here';
        const calculatedSignature = crypto.createHmac('sha256', apiSecret).update(JSON.stringify(req.body)).digest('hex');
        console.log(`Calculated Signature: ${calculatedSignature}`);

        if (!providedSignature || providedSignature !== calculatedSignature) {
            console.log('Request signature verification failed.');
            return res.status(403).end();
        }

        // Process the event
        const event = req.body;
        console.log('New event received:');
        console.log(event);

        // Handle the event using the handlers object
        const handler = handlers[event.type];
        if (handler) {
            try {
                await handler(event);  // Pass the event object to the handler
            } catch (e) {
                console.error(`Error handling '${event.type}' event:`, e);
            }
        } else {
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
    // Add your logic for handling 'profile.viewed' events here
}

function handleTradeChatContent(event) {
    console.log('Handling trade chat content event:');
    console.log(event);
    // Add your logic for handling 'trade.chat_message_received', 'trade.attachment_uploaded',
    // 'trade.bank_account_shared', 'trade.online_wallet_shared', 'trade.bank_account_selected',
    // 'trade.proof_added' events here
}

function handleTradeChatMessage(event) {
    console.log('Handling trade chat message event:');
    console.log(event);
    // Add your logic for handling 'trade.chat.message' events here
}

function handleWalletInfo(event) {
    console.log('Handling wallet info event:');
    console.log(event);
    // Add your logic for handling 'crypto.deposit_confirmed', 'crypto.deposit_pending' events here
}

function handleFeedback(event) {
    console.log('Handling feedback event:');
    console.log(event);
    // Add your logic for handling 'feedback.received', 'feedback.reply_received' events here
}

function handleTradeManagement(event) {
    console.log('Handling trade management event:');
    console.log(event);
    // Add your logic for handling 'trade.started', 'trade.paid', 'trade.cancelled_or_expired',
    // 'trade.released', 'trade.dispute_started', 'trade.dispute_finished' events here
}

function handleMerchantInvoice(event) {
    console.log('Handling merchant invoice event:');
    console.log(event);
    // Add your logic for handling 'invoice.paid', 'invoice.canceled' events here
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
