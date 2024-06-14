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

        params.append('offer_type', req.body.offer_type);
        params.append('type', req.body.type);
        params.append('group', req.body.group);
        params.append('limit', req.body.limit);
        params.append('offset', req.body.offset);
        params.append('fiat_min', req.body.fiat_min);
        params.append('geoname_id', req.body.geoname_id);
        params.append('margin_max', req.body.margin_max);
        params.append('margin_min', req.body.margin_min);
        params.append('offer_tags', req.body.offer_tags);
        params.append('user_types', req.body.user_types);
        params.append('location_id', req.body.location_id);
        params.append('user_country', req.body.user_country);
        params.append('currency_code', req.body.currency_code);
        params.append('payment_method', req.body.payment_method);
        params.append('fiat_amount_max', req.body.fiat_amount_max);
        params.append('fiat_amount_min', req.body.fiat_amount_min);
        params.append('apply_user_restrictions', req.body.apply_user_restrictions);

        const response = await axios.post(
            `${baseUrl}${apiRoute}`, 
            params,
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