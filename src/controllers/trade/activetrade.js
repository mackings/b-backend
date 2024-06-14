const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;


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
        return res.status(200).json(successResponse('Trades data retrieved successfully', response));
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