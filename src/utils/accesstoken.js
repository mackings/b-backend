const dotenv = require("dotenv").config();
const axios = require("axios");
const { errorResponse } = require("./responses");
const tokenUrl = process.env.TOKEN_URL;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


async function getAccessToken() {
    try {
      console.log('Requesting access token from URL:', tokenUrl); 
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientID,
          client_secret: clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response.data);
      return response.data.access_token;
    } catch (error) {
      console.log(error);
      console.error('Error getting access token:', error.response ? error.response.data : error.message);
      throw error;
    }
  }


  module.exports = getAccessToken;