function normalizeNeighborhood(input, neighborhoods) {
    const Fuse = require("fuse.js");

    const list = Object.keys(neighborhoods).map(n => ({ name: n }));

    const fuse = new Fuse(list, {
        keys: ["name"],
        threshold: 0.3, // lower = stricter, higher = more forgiving
    });

    const result = fuse.search(input);

    return result.length > 0 ? result[0].item.name : null;
}




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
          const normalized = normalizeNeighborhood(neighborhood, config.neighborhoods);

if (!normalized) {
    return res.status(400).json({ error: "Unknown neighborhood" });
}
     
        

        // 2. Extract base price per m²

       const basePrice = config.neighborhoods[normalized];

       // 1. Arabic normalization
if (arabicMap[neighborhood]) {
    neighborhood = arabicMap[neighborhood];
}

// 2. Fuzzy match the neighborhood
const normalized = normalizeNeighborhood(neighborhood, config.neighborhoods);

if (!normalized) {
    return res.status(400).json({ error: "Unknown neighborhood" });
}

// 3. Use the normalized neighborhood for pricing
const basePrice = config.neighborhoods[normalized];


      
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