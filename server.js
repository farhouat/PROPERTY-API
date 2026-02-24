const express = require('express');
const app = express();
const valuationConfig = require('./config/valuation.json');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/estimate', (req, res) => {
    try {
        const { neighborhood, surface, type, condition, floor } = req.body;

        const config = valuationConfig;

        // 1. Validate neighborhood
        if (!config.neighborhoods[neighborhood]) {
            return res.status(400).json({ error: "Unknown neighborhood" });
        }

        // 2. Extract base price per m²
        const basePrice = config.neighborhoods[neighborhood];

        // 3. Apply type factor
        const typeFactor = config.propertyTypes[type] || 1;

        // 4. Apply condition factor
        const conditionFactor = config.conditions[condition] || 1;

        // 5. Apply floor adjustment
        const floorFactor = 1 + (floor * 0.01); // +1% per floor

        // 6. Calculate price per m²
        const pricePerM2 = basePrice * typeFactor * conditionFactor * floorFactor;

        // 7. Final estimated price
        const estimatedPrice = Math.round(pricePerM2 * surface);

        // 8. Confidence range (±10%)
        const confidence = {
            low: Math.round(estimatedPrice * 0.9),
            high: Math.round(estimatedPrice * 1.1)
        };

        res.json({
            estimatedPrice,
            pricePerM2: Math.round(pricePerM2),
            confidence,
            inputs: { neighborhood, surface, type, condition, floor }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("Loaded config:", valuationConfig);