const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file


const app = express();
const port = 3000;


app.use(express.json());


// Access environment variables from .env file
const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
const pageId = process.env.PAGE_ID;




app.post('/post-to-facebook', async (req, res) => {
  try {
    // Get the message from the request body
    const message = req.body.message;


    // Prepare the photo source (either path or URL)
    let photoSource;
    if (req.body.photoPath) {
      // If photoPath is provided, read the image file
      const photoPath = path.join(__dirname, req.body.photoPath);
      if (!fs.existsSync(photoPath)) {
        return res.status(400).json({ error: 'Photo not found' });
      }
      photoSource = fs.createReadStream(photoPath);
    } else if (req.body.photoUrl) {
      // If photoUrl is provided, fetch the image from the URL
      const response = await axios.get(req.body.photoUrl, { responseType: 'stream' });
      photoSource = response.data;
    } else {
      // Handle case where neither photoPath nor photoUrl is provided
      return res.status(400).json({ error: 'No photo source provided' });
    }


    // Create the API URL
    const apiUrl = `https://graph.facebook.com/v12.0/${pageId}/photos`;


    // Create a new FormData object to prepare the request
    const formData = new FormData();
    formData.append('access_token', pageAccessToken);
    formData.append('message', message);
    formData.append('source', photoSource);


    // Make the API request to post the photo and message to Facebook
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });


    // Respond with the post ID from the Facebook response
    res.json({ post_id: response.data.post_id });
  } catch (error) {
    console.error('Error:', error);


    // Handle errors (either from API response or internal server error)
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'An internal server error occurred' });
    }
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


