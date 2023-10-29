# fb-Posting-API
## API Documentation: Posting Photos, Videos and Messages to Facebook Page

### Introduction

Welcome to the documentation for our API that allows you to post photos and messages to a Facebook Page using the Facebook Graph API. This guide will walk you through the necessary steps to set up your environment, obtain access tokens, and interact with the API.

### Prerequisites

Before you begin using the API, ensure you have the following prerequisites:

- A Facebook Developer account
- Familiarity with managing Facebook Pages
- Node.js and npm installed
- Basic knowledge of API concepts

### Getting Started

1. Clone the Repository:
   Clone the repository to your local machine using the command:
   git clone <https://github.com/jainnick/fb-Posting-API.git>
  
2. Install Dependencies:
   Navigate to the project directory and install the required dependencies:
   cd <project_directory>
   npm install

3. Create .env File:
   Create a `.env` file in the project directory and add your credentials:
   
   PAGE_ACCESS_TOKEN=your-access-token
   PAGE_ID=your-page-id
   

### Endpoints

#### `POST /post-to-facebook`

Uploads a PHOTO, VIDEO, GIF and message to a Facebook Page.

- Request:
  - Method: POST
  - URL: `http://localhost:3000/post-to-facebook`
  - Headers:
    - `Content-Type: application/json`
  - Body:
    json
    {
  "message": "Your message content here",
  "mediaType": "photo",
  "mediaPath": "path/to/your/photo.jpg",
  "mediaUrl": "URL_to_your_photo"
}
    
- Response:
  - Status: 200 OK
  - Body:
    json
    {
      "post_id": "your-post-id"
    }
    
### Example Requests

#### Uploading a media file from URL:

json
{
  "message": "Check out this video!",
  "mediaType":"video",
  "mediaUrl": "https://example.com/video.mp4"
}

#### Uploading Local Media file:

json
{
  "message": "My own gif!",
  "mediaType":"gif",
  "mediaPath": "path/to/local/gifhy.gif"
}

### Error Handling

- If the photo is not found or the URL is invalid, you'll receive a `400 Bad Request` response.
- If there's an issue with the API request, you'll receive an appropriate error response.

### Security Considerations

- Store your access tokens and sensitive data securely.
- Avoid sharing access tokens publicly.
- Use server-side storage for sensitive information.

### Rate Limiting

There are no specific rate limits for this API, but be mindful of Facebook's rate limits and API usage policies.

### Troubleshooting

- If you encounter errors, check the error response for more information.
- Verify your access tokens and credentials.

### Versioning

This documentation corresponds to API version 1.0. Future versions may introduce changes; refer to updated documentation for changes.

