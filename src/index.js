const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use('/',route);

const clientID = 'DcrtRJsxKgcbXWm0oHjU74Bc7i9KFKq9y8JJdk3b0mNxHUcp';
const clientSecret = 'U9PFVxPXZ7pkJPovBtLyhNVbhaZDreNGeEY6b0FAwVKsifpf';

// const clientID = 'AbgnZQxyIM259CZ7RLxibzFyeUvNsaBs26UffEP4IcNSpHD9';
// const clientSecret ='wmM4TrNmi125zGwuAb4i7jXmS7qIG9DLKaQRPOTU604v5aBF';

const tokenUrl = 'https://accounts.paxful.com/oauth2/token';
const apiUrl = 'https://api.paxful.com/paxful/v1/user/me';

// Function to get access token
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
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}


// app.use((req, res, next) => {
//   if (!Object.keys(req.body).length && !req.get('X-Paxful-Signature')) {
//     console.log('Address verification request received.');
//     const challengeHeader = 'X-Paxful-Request-Challenge';
//     res.set(challengeHeader, req.get(challengeHeader));
//     res.end();
//   } else {
//     next();
//   } 
// });


// Middleware to verify event notification signatures
// app.use((req, res, next) => {
//   const providedSignature = req.get('X-Paxful-Signature');
//   const calculatedSignature = crypto.createHmac('sha256', clientSecret).update(JSON.stringify(req.body)).digest('hex');
//   if (providedSignature !== calculatedSignature) {
//     console.log('Request signature verification failed.');
//     res.status(403).end();
//   } else {
//     next();
//   }
// });

// Endpoint to handle incoming webhook events

// app.post('https://b-backend-xe8q.onrender.com/webhook', async (req, res) => {
//   console.log('New event received:');
//   console.log(req.body);
//   res.end();
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

  // app.post('https://b-backend-xe8q.onrender.com/webhook', async (req, res) => {
  //   console.log('New event received:');
  //   console.log(req.body);
  //   res.end();
  // });
  
  console.log(`Server is running on port ${PORT}`);
});
