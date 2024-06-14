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

        // Parse and append parameters
        if (req.body.offer_type) params.append('offer_type', req.body.offer_type);
        if (req.body.type) params.append('type', req.body.type);
        if (req.body.group) params.append('group', req.body.group);
        if (req.body.limit) params.append('limit', parseInt(req.body.limit, 10));  // Ensure limit is an integer
        if (req.body.offset) params.append('offset', req.body.offset);
        if (req.body.fiat_min) params.append('fiat_min', req.body.fiat_min);
        if (req.body.geoname_id) params.append('geoname_id', req.body.geoname_id);
        if (req.body.margin_max) params.append('margin_max', req.body.margin_max);
        if (req.body.margin_min) params.append('margin_min', req.body.margin_min);
        if (req.body.offer_tags) params.append('offer_tags', req.body.offer_tags);
        if (req.body.user_types) params.append('user_types', req.body.user_types);
        if (req.body.location_id) params.append('location_id', req.body.location_id);
        if (req.body.user_country) params.append('user_country', req.body.user_country);
        if (req.body.currency_code) params.append('currency_code', req.body.currency_code);
        if (req.body.payment_method) params.append('payment_method', req.body.payment_method);
        if (req.body.fiat_amount_max) params.append('fiat_amount_max', req.body.fiat_amount_max);
        if (req.body.fiat_amount_min) params.append('fiat_amount_min', req.body.fiat_amount_min);
        if (req.body.apply_user_restrictions) params.append('apply_user_restrictions', req.body.apply_user_restrictions);

        const response = await axios.post(
            `${baseUrl}${apiRoute}`, 
            params.toString(),  // Convert URLSearchParams to string
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
