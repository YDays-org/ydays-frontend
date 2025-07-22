# API Integration for Activities Page

## Overview
The Activities page has been updated to use the backend API instead of hardcoded data. It now fetches activities by category using the `/api/catalog/listings` endpoint.

## API Endpoints Used

### 1. Get Listings with Filters
```
GET /api/catalog/listings
```

**Query Parameters:**
- `type=activity` - Filters for activities only
- `category={slug}` - Filters by category slug
- `q={search}` - Search term
- `priceMin={number}` - Minimum price filter
- `priceMax={number}` - Maximum price filter
- `page={number}` - Page number (default: 1)
- `limit={number}` - Items per page (default: 10)

**Example:**
```
GET /api/catalog/listings?type=activity&category=culture&page=1&limit=10
```

### 2. Get Categories
```
GET /api/catalog/categories
```

Returns all available categories for filtering.

## Frontend Implementation

### Files Modified:

1. **`src/services/catalogService.js`** (NEW)
   - Complete API service for catalog operations
   - Handles authentication headers automatically
   - Error handling and logging

2. **`src/services/api.js`** (UPDATED)
   - Added request/response interceptors
   - Automatic authentication token handling
   - Error handling for 401 responses

3. **`src/pages/Activities.jsx`** (UPDATED)
   - Replaced hardcoded data with API calls
   - Added loading states and error handling
   - Implemented pagination
   - Real-time filtering with API

### Key Features:

- **Real-time Filtering**: Category and price filters trigger new API calls
- **Search Functionality**: Text search across titles and descriptions
- **Pagination**: Server-side pagination with configurable page size
- **Loading States**: Loading spinner during API calls
- **Error Handling**: User-friendly error messages and retry functionality
- **Image Handling**: Fallback images for missing media
- **Authentication**: Automatic token handling for protected endpoints

## Environment Setup

Make sure your backend server is running on the correct port. The default API URL is:
```
http://localhost:4000
```

You can override this by setting the `VITE_API_BASE_URL` environment variable.

## Usage

1. **Start the backend server** (if not already running):
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend development server**:
   ```bash
   cd web
   npm run dev
   ```

3. **Navigate to the Activities page** and test the filtering functionality.

## API Response Format

The listings API returns:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Activity Title",
      "description": "Activity description",
      "type": "activity",
      "address": "Activity address",
      "cheapest_price": 150,
      "average_rating": 4.5,
      "review_count": 10,
      "cover_image": {
        "mediaUrl": "https://example.com/image.jpg",
        "isCover": true
      },
      "category": {
        "id": 1,
        "name": "Culture",
        "slug": "culture"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## Testing

To test the API integration:

1. **Category Filtering**: Select different categories and verify the API calls
2. **Search**: Enter search terms and check the results
3. **Price Filtering**: Use price range filters
4. **Pagination**: Navigate through pages
5. **Error Handling**: Test with network issues or invalid responses

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure the backend has proper CORS configuration
2. **Authentication Errors**: Check if the auth token is being sent correctly
3. **API Not Found**: Verify the backend server is running and accessible
4. **Empty Results**: Check if there are activities in the database with the correct type and category

### Debug Tips:

- Check browser network tab for API calls
- Verify API responses in the console
- Check backend logs for any errors
- Ensure database has sample data for testing 