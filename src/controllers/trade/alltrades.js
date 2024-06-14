const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();
const baseUrl = process.env.BASE_URL;

const initial = 'https://api.paxful.com/paxful/v1/trade/list'


exports.getTrades = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const apiRoute = '/trade/list'; 
        const response = await axios.post(
            `${baseUrl}${apiRoute}`, 
            new URLSearchParams(),

            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: req.query 
            }
        );
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