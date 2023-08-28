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

// Endpoint for posting to Facebook
app.post('/post-to-facebook', async (req, res) => {
  try {
    // Get message and media type from request body
    const message = req.body.message;
    const mediaType = req.body.mediaType; // 'photo', 'video', 'gif', 'message'

    if (mediaType === 'photo' || mediaType === 'video' || mediaType === 'gif') {
      // Get media path and URL from request body
      const mediaPath = req.body.mediaPath;
      const mediaUrl = req.body.mediaUrl;

      if (!mediaPath && !mediaUrl) {
        return res.status(400).json({ error: 'Media source not provided' });
      }

      // Determine the appropriate media source based on media type
      let mediaSource;
      if (mediaPath) {
        const fullPath = path.join(__dirname, mediaPath);
        if (!fs.existsSync(fullPath)) {
          return res.status(400).json({ error: 'Media not found' });
        }
        mediaSource = fs.createReadStream(fullPath);
      } else if (mediaUrl) {
        const response = await axios.get(mediaUrl, { responseType: 'stream' });
        mediaSource = response.data;
      }

      // Determine the appropriate API URL based on media type
      const apiUrl = mediaType === 'photo'
        ? `https://graph.facebook.com/v12.0/${pageId}/photos`
        : `https://graph-video.facebook.com/v12.0/${pageId}/videos`;

      // Create form data and append necessary fields
      const formData = new FormData();
      formData.append('access_token', pageAccessToken);
      formData.append('message', message);
      formData.append('source', mediaSource);

      // Make the API request to post the media
      const response = await axios.post(apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      res.json({ post_id: response.data.id });

    } else if (mediaType === 'message') {
      // If media type is 'message', post only the message content
      const apiUrl = `https://graph.facebook.com/v12.0/${pageId}/feed`;

      const postData = {
        message: message,
        access_token: pageAccessToken,
      };

      const response = await axios.post(apiUrl, postData);

      res.json({ post_id: response.data.id });

    } else {
      return res.status(400).json({ error: 'Invalid media type' });
    }
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
