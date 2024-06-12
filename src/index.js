const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// const clientID = 'DcrtRJsxKgcbXWm0oHjU74Bc7i9KFKq9y8JJdk3b0mNxHUcp';
// const clientSecret = 'U9PFVxPXZ7pkJPovBtLyhNVbhaZDreNGeEY6b0FAwVKsifpf';
const clientID = 'DPchEz4arwrdeHNIGPLwbAB01pdcfxpy';
const clientSecret ='SDIm9zEketKroDiwaQv5YrtV7YDIHw61';
const tokenUrl = 'https://accounts.paxful.com/oauth2/token';
const apiUrl = 'https://api.paxful.com/paxful/v1/user/me';

// Function to get access token
async function getAccessToken() {
  try {
    console.log('Requesting access token from URL:', tokenUrl); // Debugging line
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
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Route to make the POST request to Paxful API
app.post('/paxful/user/me', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      apiUrl,
      new URLSearchParams(), // pass empty params since the API doesn't require any parameters
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded', // Adjusted content type
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error making API request:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
