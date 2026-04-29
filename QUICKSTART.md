# 🏠 Morocco Property Valuation API - Quick Start Guide

## ✅ What's Been Fixed

Your Property Valuation API has been completely updated and is now **fully functional** for WordPress integration with the following improvements:

### ✨ New Features
1. ✅ **Complete Data Integration**: Uses comprehensive Morocco property dataset (53+ cities)
2. ✅ **All Required Fields**: City, Neighborhood, Surface Area, Property Type, Condition, Floor
3. ✅ **Smart Fallbacks**: Handles unknown cities/neighborhoods gracefully
4. ✅ **Price Ranges**: Provides min/max estimates
5. ✅ **Floor Adjustments**: Accounts for floor level in pricing
6. ✅ **Multiple Endpoints**: 
   - `POST /api/estimate` - Get property valuation
   - `GET /api/cities` - List all available cities
   - `GET /api/neighborhoods/:city` - List neighborhoods for a city
7. ✅ **CORS Enabled**: Ready for WordPress integration
8. ✅ **Better Error Handling**: Clear error messages for validation

---

## 🚀 Quick Start

### 1. Start the API Server
```bash
cd PROPERTY-API
npm start
```

Server will run on: `http://localhost:3000`

### 2. Test the API
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Casablanca",
    "neighborhood": "Maarif",
    "surface": 100,
    "type": "Apartment",
    "condition": "Good",
    "floor": 3
  }'
```

### 3. Open the Demo Form
Open `wordpress-integration.html` in your browser to test the user interface.

---

## 📋 API Usage Examples

### Example 1: Apartment in Casablanca
```json
{
  "city": "Casablanca",
  "neighborhood": "Maarif",
  "surface": 100,
  "type": "Apartment",
  "condition": "Good",
  "floor": 3
}
```

**Response:**
```json
{
  "success": true,
  "city": "Casablanca",
  "neighborhood": "Maarif",
  "surface": 100,
  "propertyType": "Apartment",
  "condition": "Good",
  "floor": 3,
  "standing": "moyen_haut",
  "pricePerM2": 17175,
  "estimatedPrice": 1717525,
  "estimatedPriceRange": {
    "min": 1545773,
    "max": 1889278
  },
  "currency": "MAD"
}
```

### Example 2: Villa in Rabat
```json
{
  "city": "Rabat",
  "neighborhood": "Agdal",
  "surface": 200,
  "type": "Villa",
  "condition": "Excellent",
  "floor": 2
}
```

### Example 3: Studio in Marrakech
```json
{
  "city": "Marrakech",
  "neighborhood": "Guéliz",
  "surface": 50,
  "type": "Studio",
  "condition": "Good",
  "floor": 1
}
```

---

## 📁 Files Overview

| File | Description |
|------|-------------|
| `server.js` | Main API server with all endpoints |
| `services/valuationService.js` | Property valuation logic |
| `data/morocco_valuation_dataset.json` | Complete Morocco property data (53+ cities) |
| `wordpress-integration.html` | Ready-to-use HTML form for WordPress |
| `WORDPRESS_INTEGRATION.md` | Detailed WordPress integration guide |
| `test-api.sh` | Automated test script |
| `.env.example` | Environment configuration template |

---

## 🔗 WordPress Integration

### Method 1: Embed HTML Form (Easiest)
1. Copy the content of `wordpress-integration.html`
2. In WordPress, create a new page
3. Switch to "Code Editor" view
4. Paste the HTML content
5. Update the API URL to your production URL
6. Publish the page

### Method 2: Use Shortcode
Add to `functions.php`:
```php
function property_estimator_shortcode() {
    // Include the HTML form
    return file_get_contents('path/to/wordpress-integration.html');
}
add_shortcode('property_estimator', 'property_estimator_shortcode');
```

Usage: `[property_estimator]`

### Method 3: Custom JavaScript
Use the JavaScript from the HTML form in your theme's JS file.

---

## 🎯 Required Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `city` | String | ✅ | City name (e.g., Casablanca, Rabat) |
| `neighborhood` | String | ✅ | Neighborhood name |
| `surface` | Number | ✅ | Surface area in m² |
| `type` | String | ✅ | Property type (Apartment, Villa, Studio, Duplex, Penthouse) |
| `condition` | String | ✅ | Property condition (Excellent, Good, Average, Needs Renovation) |
| `floor` | Number | ❌ | Floor number (default: 1) |

---

## 🌍 Available Cities (53+)

The API supports:
- **Casablanca** (29 neighborhoods)
- **Rabat** (10 neighborhoods)
- **Marrakech** (15 neighborhoods)
- **Tanger** (11 neighborhoods)
- **Fès** (8 neighborhoods)
- **Agadir** (7 neighborhoods)
- **Salé**, **Témara**, **Mohammedia**, **Bouskoura**
- And 45+ more cities...

Get full list: `GET http://localhost:3000/api/cities`

---

## 🔧 Configuration

### Port Configuration
Default: `3000`

Change via environment variable:
```bash
PORT=5000 npm start
```

### CORS Configuration
CORS is already enabled for all origins in development.

For production, update in `server.js`:
```javascript
app.use(cors({
    origin: ['https://your-wordpress-site.com']
}));
```

---

## 🧪 Testing

### Run All Tests
```bash
./test-api.sh
```

### Manual Testing
```bash
# Get cities
curl http://localhost:3000/api/cities

# Get neighborhoods
curl http://localhost:3000/api/neighborhoods/Casablanca

# Get estimate
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"city":"Casablanca","neighborhood":"Maarif","surface":100,"type":"Apartment","condition":"Good","floor":3}'
```

---

## 📊 Pricing Logic

The API calculates property prices based on:

1. **Base Price per m²**: From Morocco valuation dataset
2. **Standing Factor**: économique (0.85x) → luxe (1.5x)
3. **Property Type**: Apartment (1x), Villa (1.6x), Studio (0.85x), etc.
4. **Condition**: Excellent (1.1x) → Needs Renovation (0.75x)
5. **Floor Adjustment**: Ground floor (-5%) → High floors (+8%)
6. **Growth Factor**: City-specific appreciation rate

**Formula:**
```
Final Price = Base Price × Standing × Type × Condition × Floor × Surface
```

---

## 🚀 Production Deployment

### Deploy to Heroku
```bash
heroku create your-property-api
git push heroku main
heroku ps:scale web=1
```

### Deploy to DigitalOcean
1. Create Ubuntu Droplet
2. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -`
3. Clone repository
4. Run: `npm install && npm start`
5. Use PM2 for process management: `pm2 start server.js`

### Deploy with Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security for Production

1. **Use HTTPS**: Deploy with SSL certificate
2. **Rate Limiting**: Add express-rate-limit
3. **API Key**: Add authentication for API access
4. **Environment Variables**: Use `.env` file for sensitive config
5. **Input Validation**: Already implemented, but can be enhanced

---

## 🐛 Troubleshooting

### Server won't start
```bash
npm install
npm start
```

### CORS errors
- API already has CORS enabled
- Check browser console for specific error
- Verify API URL is correct

### "City not found"
- API is case-insensitive
- Check spelling
- Use `GET /api/cities` to see available cities

### Form not working in WordPress
1. Check JavaScript console for errors
2. Verify API URL (must include http:// or https://)
3. If WordPress uses HTTPS, API must also use HTTPS

---

## 📞 Support

For issues or questions:
1. Check `WORDPRESS_INTEGRATION.md` for detailed guide
2. Run `test-api.sh` to verify API is working
3. Test with `wordpress-integration.html` demo form

---

## 📝 Available Property Types

- **Apartment** - Standard apartment
- **Villa** - Luxury villa (1.6x multiplier)
- **Studio** - Studio apartment (0.85x multiplier)
- **Duplex** - Duplex apartment (1.25x multiplier)
- **Penthouse** - Penthouse (1.8x multiplier)

---

## 🎨 Customization

### Customize Form Styling
Edit the CSS in `wordpress-integration.html` or add custom CSS to your WordPress theme.

### Add More Fields
Modify `services/valuationService.js` to add custom factors like:
- Garage
- Garden/Balcony
- Furnished/Unfurnished
- Year built

---

## ✨ Next Steps

1. ✅ API is running and tested
2. ✅ Integration files are ready
3. ✅ Choose your WordPress integration method
4. ✅ Deploy to production server
5. ✅ Update API URL in WordPress form
6. ✅ Test with real users

---

**Your Property Valuation API is ready for WordPress integration! 🎉**
