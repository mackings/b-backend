const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;



exports.getOffer = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const accessToken = await getAccessToken();
        const apiRoute = '/offer/all'; 
        const params = new URLSearchParams();

        // Parse and append parameterssss
        params.append('offer_type', "sell");
        params.append('user_country', "NGA");

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
        console.log('Response:', params);
        console.log('Response:', response.data);
        return res.status(200).json(successResponse('Offer data retrieved successfully', response.data));
    } catch (error) {
        console.error('Error making API request:', error);
        return res.status(error.response ? error.response.status : 500).json(
            errorResponse(
                'Failed to fetch offer data',
                error.response ? error.response.status : 500,
                error
            )
        );
    }
};




exports.getOffers = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const accessToken = await getAccessToken();
        const apiRoute = '/offer/get'; 
        const params = new URLSearchParams();

        // Parse and append parameterssss
        params.append('offer_hash', req.body.offer_hash);

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
        console.log('Response:', params);
        console.log('Response:', response.data);
        return res.status(200).json(successResponse('Offer data retrieved successfully', response.data));
    } catch (error) {
        console.error('Error making API request:', error);
        return res.status(error.response ? error.response.status : 500).json(
            errorResponse(
                'Failed to fetch offer data',
                error.response ? error.response.status : 500,
                error
            )
        );
    }
};
