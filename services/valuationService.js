const fs = require('fs');
const path = require('path');

// -------------------------------
// Load cities data safely
// -------------------------------
let citiesData = {};

try {
    const dataPath = path.join(__dirname, '../data/cities.json');
    citiesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
    console.error("Failed to load cities data:", err.message);
}

// -------------------------------
// UNIFIED ESTIMATE FUNCTION
// -------------------------------
function unifiedEstimate(data) {

    const city = (data.city || 'Casablanca').toLowerCase();
    const neighborhood = (data.neighborhood || '').toLowerCase();
    const surface = Number(data.surface) || 0;

    if (!neighborhood) {
        return { error: "Neighborhood is required" };
    }

    const cityData = citiesData[city];

    if (!cityData) {
        return { error: "Unknown city" };
    }

    const matchKey = Object.keys(cityData).find(key =>
        key.toLowerCase().includes(neighborhood)
    );

    if (!matchKey) {
        return { error: "Unknown neighborhood" };
    }

    const basePrice = cityData[matchKey];

    if (!basePrice) {
        return { error: "No price data found" };
    }

    let price = surface * basePrice;

    // adjustments
    if (data.type === 'Villa') price *= 1.3;
    if (data.type === 'Studio') price *= 0.9;

    if (data.condition === 'Excellent') price *= 1.1;
    if (data.condition === 'Needs Renovation') price *= 0.85;

    return {
        city,
        neighborhood: matchKey,
        estimatedPrice: Math.round(price)
    };
}

module.exports = {
    unifiedEstimate
};