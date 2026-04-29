# Morocco Property Valuation API - WordPress Integration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [API Setup](#api-setup)
3. [WordPress Integration Methods](#wordpress-integration-methods)
4. [Method 1: Using HTML/JavaScript Form](#method-1-using-htmljavascript-form)
5. [Method 2: Using WordPress Shortcode](#method-2-using-wordpress-shortcode)
6. [Method 3: Using WP REST API](#method-3-using-wp-rest-api)
7. [Styling Customization](#styling-customization)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This API provides property valuation estimates for **53+ Moroccan cities** with the following features:

- ✅ **City & Neighborhood Support**: Comprehensive coverage of Moroccan cities
- ✅ **Property Types**: Apartment, Villa, Studio, Duplex, Penthouse
- ✅ **Condition Assessment**: Excellent, Good, Average, Needs Renovation
- ✅ **Floor Adjustments**: Accounts for floor level in pricing
- ✅ **Price Ranges**: Provides min/max estimates
- ✅ **Future Valuation**: Includes growth factor projections

---

## API Setup

### 1. Install Dependencies

```bash
cd PROPERTY-API
npm install
```

### 2. Start the Server

```bash
npm start
```

The API runs on `http://localhost:3000` by default.

### 3. Test the API

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

---

## WordPress Integration Methods

### Method 1: Using HTML/JavaScript Form (Recommended)

This is the simplest method and works with any WordPress site.

#### Steps:

1. **Upload the HTML Form**
   - Copy the `wordpress-integration.html` file content
   - In WordPress, create a new page
   - Switch to "Code Editor" view
   - Paste the HTML content

2. **Update API URL**
   - Find this line in the HTML:
   ```javascript
   const API_URL = 'http://localhost:3000/api/estimate';
   ```
   - Replace with your actual API URL (must be HTTPS for production)

3. **Embed as iframe** (Alternative)
   ```html
   <iframe src="your-domain.com/property-estimator" width="100%" height="800px"></iframe>
   ```

#### Using Custom HTML Block:

1. Add a "Custom HTML" block in WordPress
2. Paste the form HTML
3. Update the API URL
4. Publish the page

---

### Method 2: Using WordPress Shortcode

Add this to your theme's `functions.php` file:

```php
// Property Estimator Shortcode
function property_estimator_shortcode() {
    ob_start();
    ?>
    <div class="property-estimator-wrapper">
        <form id="propertyForm" class="property-form">
            <div class="form-group">
                <label>City *</label>
                <input type="text" id="city" name="city" required placeholder="e.g., Casablanca">
            </div>
            
            <div class="form-group">
                <label>Neighborhood *</label>
                <input type="text" id="neighborhood" name="neighborhood" required placeholder="e.g., Maarif">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Surface Area (m²) *</label>
                    <input type="number" id="surface" name="surface" min="10" max="1000" required>
                </div>
                
                <div class="form-group">
                    <label>Property Type *</label>
                    <select id="type" name="type" required>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Studio">Studio</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Penthouse">Penthouse</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Condition *</label>
                    <select id="condition" name="condition" required>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Needs Renovation">Needs Renovation</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Floor</label>
                    <input type="number" id="floor" name="floor" min="0" max="20" value="1">
                </div>
            </div>
            
            <button type="submit" class="estimate-btn">Get Estimate</button>
        </form>
        
        <div id="resultContainer" class="result-container" style="display:none;">
            <h3>Property Estimate</h3>
            <div class="price-display">
                <div class="price-value" id="estimatedPrice">-</div>
                <div class="price-range" id="priceRange">-</div>
            </div>
        </div>
        
        <script>
        document.getElementById('propertyForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                city: document.getElementById('city').value,
                neighborhood: document.getElementById('neighborhood').value,
                surface: parseInt(document.getElementById('surface').value),
                type: document.getElementById('type').value,
                condition: document.getElementById('condition').value,
                floor: parseInt(document.getElementById('floor').value) || 1
            };
            
            try {
                const response = await fetch('YOUR_API_URL/api/estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.estimatedPrice) {
                    document.getElementById('estimatedPrice').textContent = 
                        data.estimatedPrice.toLocaleString() + ' MAD';
                    document.getElementById('priceRange').textContent = 
                        'Range: ' + data.estimatedPriceRange.min.toLocaleString() + 
                        ' - ' + data.estimatedPriceRange.max.toLocaleString() + ' MAD';
                    document.getElementById('resultContainer').style.display = 'block';
                }
            } catch (error) {
                alert('Error getting estimate: ' + error.message);
            }
        });
        </script>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('property_estimator', 'property_estimator_shortcode');
```

**Usage:** Add `[property_estimator]` to any page or post.

---

### Method 3: Using WP REST API

For advanced integration with WordPress themes:

```javascript
// Add to your theme's JavaScript file
jQuery(document).ready(function($) {
    $('#property-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            city: $('#city').val(),
            neighborhood: $('#neighborhood').val(),
            surface: $('#surface').val(),
            type: $('#type').val(),
            condition: $('#condition').val(),
            floor: $('#floor').val()
        };
        
        $.ajax({
            url: 'YOUR_API_URL/api/estimate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                if (response.estimatedPrice) {
                    $('#result').html(
                        '<h3>Estimated Price: ' + 
                        response.estimatedPrice.toLocaleString() + 
                        ' MAD</h3>'
                    );
                }
            },
            error: function(xhr) {
                $('#result').html('<p>Error: ' + xhr.responseJSON.error + '</p>');
            }
        });
    });
});
```

---

## API Endpoints

### 1. Get Property Estimate

**Endpoint:** `POST /api/estimate`

**Request Body:**
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
  "estimatedFuturePrice": 1786226,
  "currency": "MAD",
  "disclaimer": "This is an estimated value..."
}
```

### 2. Get All Cities

**Endpoint:** `GET /api/cities`

**Response:**
```json
{
  "success": true,
  "count": 53,
  "cities": ["Casablanca", "Rabat", "Marrakech", ...]
}
```

### 3. Get Neighborhoods by City

**Endpoint:** `GET /api/neighborhoods/:city`

**Example:** `GET /api/neighborhoods/Casablanca`

**Response:**
```json
{
  "success": true,
  "city": "Casablanca",
  "count": 29,
  "neighborhoods": ["Maarif", "Anfa", "Gauthier", ...]
}
```

---

## Styling Customization

### CSS Variables

Add to your WordPress theme's Custom CSS:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #333;
    --border-color: #e0e0e0;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.property-estimator {
    max-width: 600px;
    margin: 40px auto;
    padding: 40px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.property-form input,
.property-form select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.3s;
}

.property-form input:focus,
.property-form select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.estimate-btn {
    width: 100%;
    padding: 15px;
    background: var(--background-gradient);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.estimate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}
```

---

## Production Deployment

### Option 1: Deploy to Cloud Server

1. **Deploy to Heroku:**
   ```bash
   heroku create your-property-api
   git push heroku main
   ```

2. **Deploy to DigitalOcean:**
   - Create a Droplet
   - Install Node.js
   - Clone your repository
   - Run `npm start`

3. **Deploy to Vercel:**
   ```bash
   vercel deploy
   ```

### Option 2: Use with WordPress Hosting

If your WordPress hosting supports Node.js:
1. Upload the API to a subdirectory
2. Configure the port
3. Update the API URL in your WordPress form

---

## Troubleshooting

### CORS Issues

If you get CORS errors, the API already has CORS enabled. Make sure:
- Your API URL is correct
- The API server is running
- You're using HTTPS in production

### "City not found" Error

- Check the city name spelling
- Use the `GET /api/cities` endpoint to see all available cities
- The API is case-insensitive

### "Neighborhood is required" Error

- Ensure the neighborhood field is not empty
- The API will try to fuzzy-match if exact name isn't found

### API Not Responding

1. Check if the server is running:
   ```bash
   curl http://localhost:3000
   ```

2. Verify the port is not blocked by firewall

3. Check the API URL in your WordPress form matches your deployment URL

### Form Not Submitting in WordPress

1. **Check JavaScript conflicts:**
   - Open browser console (F12)
   - Look for JavaScript errors

2. **Verify API URL:**
   - Make sure it's the full URL including `http://` or `https://`

3. **HTTPS Requirement:**
   - If your WordPress site uses HTTPS, your API must also use HTTPS

---

## Support

For issues or questions:
1. Check the API is running: `curl http://localhost:3000`
2. Test with the included HTML form
3. Check browser console for JavaScript errors
4. Verify the API URL is correct

---

## License

This API is provided as-is for property valuation estimates. Actual property prices may vary based on market conditions, exact location, and property specifics.
