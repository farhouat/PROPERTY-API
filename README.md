# 🏠 Morocco Property Valuation API

A comprehensive property valuation API for Moroccan real estate with support for **53+ cities** and **200+ neighborhoods**. Perfect for integration with WordPress websites.

## ✨ Features

- 🏙️ **53+ Moroccan Cities** - Complete coverage from Casablanca to Dakhla
- 🏘️ **200+ Neighborhoods** - Detailed neighborhood-level pricing
- 🏗️ **Multiple Property Types** - Apartments, Villas, Studios, Duplexes, Penthouses
- 📊 **Accurate Estimates** - Based on real market data
- 📈 **Growth Projections** - Future price estimates included
- 🔄 **Smart Fallbacks** - Handles unknown locations gracefully
- 🌐 **CORS Enabled** - Ready for WordPress integration
- ⚡ **Fast Response** - Instant valuations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Test the API
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"city":"Casablanca","neighborhood":"Maarif","surface":100,"type":"Apartment","condition":"Good","floor":3}'
```

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide
- **[WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md)** - Detailed WordPress integration guide
- **[wordpress-integration.html](./wordpress-integration.html)** - Ready-to-use HTML form

## 🔗 API Endpoints

### Get Property Estimate
```
POST /api/estimate
Body: { city, neighborhood, surface, type, condition, floor }
```

### Get All Cities
```
GET /api/cities
```

### Get Neighborhoods
```
GET /api/neighborhoods/:city
```

## 🎯 Example Usage

```javascript
const response = await fetch('http://localhost:3000/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        city: 'Casablanca',
        neighborhood: 'Maarif',
        surface: 100,
        type: 'Apartment',
        condition: 'Good',
        floor: 3
    })
});

const data = await response.json();
console.log(data.estimatedPrice); // 1717525 MAD
```

## 📦 WordPress Integration

1. **Copy** `wordpress-integration.html` to your WordPress site
2. **Update** the API URL to your production server
3. **Embed** using Custom HTML block or shortcode

See [WORDPRESS_INTEGRATION.md](./WORDPRESS_INTEGRATION.md) for detailed instructions.

## 🌍 Supported Cities

Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Salé, Témara, Mohammedia, Bouskoura, Dar Bouazza, Meknès, Oujda, Nador, Laayoune, Dakhla, and 40+ more cities.

## 🧪 Testing

Run the test script:
```bash
./test-api.sh
```

## 📊 Data Source

Based on comprehensive Morocco property valuation dataset with real market prices.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **Morocco Valuation Dataset** - 53+ cities, 200+ neighborhoods

## 📄 License

This API is provided as-is for property valuation estimates.

## 🤝 Support

For issues or questions, please refer to the documentation files.

---

**Made for Moroccan Real Estate Market 🇲🇦**
