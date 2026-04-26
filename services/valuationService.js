const express = require('express');
const app = express();

const { unifiedEstimate } = require('./services/valuationService');

app.use(express.json());

// -------------------------------
// Root route
// -------------------------------
app.get('/', (req, res) => {
    res.send('Property Valuation API is running');
});

// -------------------------------
// UNIFIED VALUATION ENGINE
// Supports all 53 Moroccan cities
// Body: { city, neighborhood, surface, type, condition, floor, standing }
// If city is omitted or "Casablanca", uses the detailed Casablanca engine
// -------------------------------
app.post('/api/estimate', (req, res) => {
    const result = unifiedEstimate(req.body);

    if (result.error) {
        return res.status(400).json(result);
    }

    res.json(result);
});

// -------------------------------
// LEGACY CASABLANCA ROUTE
// Kept for backward compatibility
// Body: { neighborhood, surface, type, condition, floor }
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
