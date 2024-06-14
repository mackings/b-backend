const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;





exports.getOffer = async (req, res) => {
    try {
      
        console.log('Request body:', req.body);

        const accessToken = await getAccessToken();
        const apiRoute = '/offer/list'; 

        // Check if required parameters are defined
        if (!req.body.offer_hash || !req.body.another_param) {
            return res.status(400).json(errorResponse('offer_hash and another_param are required', 400));
        }

        // Create URLSearchParams with the parameters
        const params = new URLSearchParams();
        params.append('active', req.body.active);
        params.append('offer_type', req.body.offer_type);

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