const express = require('express');
const Fuse = require('fuse.js');
const app = express();
const valuationConfig = require('./config/valuation.json');

app.use(express.json());

console.log("Loaded config:", valuationConfig);

// -------------------------------
// Arabic → French neighborhood map
// -------------------------------
const arabicMap = {
    "الوفاق": "Al Wifaq",
    "المنار": "Al Manar",
    "الفلاح": "Al Falah",
    "اولفا": "Oulfa",
    "المعاريف": "Maarif",
    "المعاريف إكستنشن": "Maarif Extension",
    "كاليفورنيا": "Californie",
    "عين الذياب": "Ain Diab",
    "عين السبع": "Ain Sebaa",
    "سيدي معروف": "Sidi Maarouf",
    "مرس السلطان": "Mers Sultan"
};

// -------------------------------
// Fuzzy matching helper
// -------------------------------
function normalizeNeighborhood(input, neighborhoods) {
    const list = Object.keys(neighborhoods).map(n => ({ name: n }));

    const fuse = new Fuse(list, {
        keys: ["name"],
        threshold: 0.3
    });

    const result = fuse.search(input);

    return result.length > 0 ? result[0].item.name : null;
}

// -------------------------------
// Root route
// -------------------------------
app.get('/', (req, res) => {
  res.send('API is running');
});

// -------------------------------
// Valuation route
// -------------------------------
app.post('/estimate', (req, res) => {
    try {
        let { neighborhood, surface, type, condition, floor } = req.body;
        const config = valuationConfig;

        // 1. Arabic normalization
        if (arabicMap[neighborhood]) {
            neighborhood = arabicMap[neighborhood];
        }

        // 2. Fuzzy matching
        const normalized = normalizeNeighborhood(neighborhood, config.neighborhoods);

        if (!normalized) {
            return res.status(400).json({ error: "Unknown neighborhood" });
        }

        // 3. Base price
        let basePrice = config.neighborhoods[normalized];

        // 4. Property type factor
        let typeFactor = config.propertyTypes[type] || 1;

        // 5. Villa premium (neighborhood‑specific)
        if (type === "Villa" && config.villaPremium && config.villaPremium[normalized]) {
            typeFactor *= config.villaPremium[normalized];
        }

        // 6. Condition factor
        const conditionFactor = config.conditions[condition] || 1;

        // 7. Floor factor
        const floorFactor = 1 + (floor * 0.01);

        // 8. Final price per m²
        const pricePerM2 = basePrice * typeFactor * conditionFactor * floorFactor;

        // 9. Estimated price
        const estimatedPrice = Math.round(pricePerM2 * surface);

        // 10. Volatility-based confidence
        const vol = config.volatility?.[normalized] || 0.1;

        const confidence = {
            low: Math.round(estimatedPrice * (1 - vol)),
            high: Math.round(estimatedPrice * (1 + vol))
        };

        // 11. Min/max range (if available)
        const range = config.ranges?.[normalized] || null;

        // 12. Response
        res.json({
            neighborhood: normalized,
            estimatedPrice,
            pricePerM2: Math.round(pricePerM2),
            confidence,
            range,
            inputs: { neighborhood, surface, type, condition, floor }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// Start server
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));