const axios = require('axios');
const  getAccessToken  = require('../../utils/accesstoken');
const { successResponse, errorResponse } = require('../../utils/responses');
require('dotenv').config();

const apiUrl = process.env.API_URL;



exports.getUser = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post(
            apiUrl,
            new URLSearchParams(), 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return res.status(200).json(successResponse('User data retrieved successfully', response.data));
    } catch (error) {
        return res.status(error.response ? error.response.status : 500).json(
            errorResponse(
                'Failed to fetch user data',
                error.response ? error.response.status : 500,
                error
            )
        );
    }
};
