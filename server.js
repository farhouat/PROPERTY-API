const express = require('express');
const app = express();
const cors = require('cors');
const { unifiedEstimate } = require('./services/valuationService');

app.use(express.json());
app.use(cors()); // Enable CORS for WordPress integration

// -------------------------------
// Root route
// -------------------------------
app.get('/', (req, res) => {
    res.json({
        message: 'Property Valuation API is running',
        version: '2.0',
        endpoints: {
            'POST /api/estimate': 'Get property estimation with full parameters',
            'GET /api/cities': 'List all available cities',
            'GET /api/neighborhoods/:city': 'List neighborhoods for a specific city'
        }
    });
});

// -------------------------------
// GET ALL CITIES
// Returns list of all available Moroccan cities
// -------------------------------
app.get('/api/cities', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, 'data/morocco_valuation_dataset.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        const cities = Object.keys(data).filter(key => 
            key !== 'DEFAULT_CITY' && key !== 'FALLBACK_RULES'
        );
        
        res.json({
            success: true,
            count: cities.length,
            cities: cities
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// GET NEIGHBORHOODS BY CITY (QUERY PARAM)
// Returns all neighborhoods for a specific city using query parameter
// -------------------------------
app.get('/api/neighborhoods', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, 'data/morocco_valuation_dataset.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Get city from query parameter
        const city = req.query.city;
        
        // Validate city parameter
        if (!city || typeof city !== 'string' || city.trim() === '') {
            console.log("City received:", city);
            return res.status(400).json({ 
                error: "City is required" 
            });
        }
        
        // Normalize city: trim spaces and convert to lowercase
        const normalizedCity = city.trim().toLowerCase();
        console.log("City received:", city);
        
        // Find city (case-insensitive)
        const cityKey = Object.keys(data).find(key => 
            key.toLowerCase() === normalizedCity
        );
        
        // If city not found, return empty neighborhoods array
        if (!cityKey) {
            return res.json({ 
                neighborhoods: [] 
            });
        }
        
        // Extract neighborhoods
        const neighborhoods = Object.keys(data[cityKey].neighborhoods);
        
        res.json({
            neighborhoods: neighborhoods
        });
    } catch (err) {
        console.error("Error in /api/neighborhoods endpoint:", err);
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// GET NEIGHBORHOODS BY CITY (PATH PARAM - LEGACY)
// Kept for backward compatibility
// -------------------------------
app.get('/api/neighborhoods/:city', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, 'data/morocco_valuation_dataset.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        const cityName = req.params.city;
        const cityKey = Object.keys(data).find(key => 
            key.toLowerCase() === cityName.toLowerCase()
        );
        
        if (!cityKey) {
            return res.status(404).json({ 
                success: false,
                error: 'City not found' 
            });
        }
        
        const neighborhoods = Object.keys(data[cityKey].neighborhoods);
        
        res.json({
            success: true,
            city: cityKey,
            count: neighborhoods.length,
            neighborhoods: neighborhoods
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// UNIFIED VALUATION ENGINE
// Supports all 53+ Moroccan cities
// Body: { city, neighborhood, surface, type, condition, floor, standing }
// -------------------------------
app.post('/api/estimate', (req, res) => {
    try {
        const result = unifiedEstimate(req.body);

        if (result.error) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

// -------------------------------
// LEGACY CASABLANCA ROUTE
// Kept for backward compatibility
// -------------------------------
app.post('/estimate', (req, res) => {
    try {
        const result = unifiedEstimate({
            ...req.body,
            city: 'Casablanca'
        });

        if (result.error) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// Start server
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Property Valuation API running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});
