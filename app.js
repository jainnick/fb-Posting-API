const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
const pageId = process.env.PAGE_ID;

app.post('/post-to-facebook', async (req, res) => {
  try {
    const message = req.body.message;
    const photoPath = req.body.photoPath;
    const photoUrl = req.body.photoUrl;

    let apiUrl, formData;

    if (photoPath || photoUrl) {
      // Handle photo upload
      apiUrl = `https://graph.facebook.com/v12.0/${pageId}/photos`;

      if (photoPath) {
        const photoFullPath = path.join(__dirname, photoPath);
        if (!fs.existsSync(photoFullPath)) {
          return res.status(400).json({ error: 'Photo not found' });
        }
        formData = new FormData();
        formData.append('access_token', pageAccessToken);
        formData.append('message', message);
        formData.append('source', fs.createReadStream(photoFullPath));
      } else if (photoUrl) {
        const response = await axios.get(photoUrl, { responseType: 'stream' });
        formData = new FormData();
        formData.append('access_token', pageAccessToken);
        formData.append('message', message);
        formData.append('source', response.data);
      }
    } else {
      // Handle message only
      apiUrl = `https://graph.facebook.com/v12.0/${pageId}/feed`;
      formData = {
        message: message,
        access_token: pageAccessToken,
      };
    }

    const response = await axios.post(apiUrl, formData, {
      headers: formData instanceof FormData ? formData.getHeaders() : {},
    });

    res.json({ post_id: response.data.id });
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'An internal server error occurred' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});