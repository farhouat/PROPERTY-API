const fs = require('fs');
const path = require('path');

// -------------------------------
// Load Morocco valuation dataset
// -------------------------------
let moroccoData = {};

try {
    const dataPath = path.join(__dirname, '../data/morocco_valuation_dataset.json');
    moroccoData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
    console.error("Failed to load Morocco valuation data:", err.message);
}

// -------------------------------
// Standing adjustment factors
// -------------------------------
const STANDING_FACTORS = {
    'economique': 0.85,
    'moyen': 1.00,
    'moyen_haut': 1.15,
    'haut': 1.30,
    'luxe': 1.50
};

// -------------------------------
// Property type multipliers
// -------------------------------
const PROPERTY_TYPES = {
    'Apartment': 1.0,
    'Villa': 1.6,
    'Studio': 0.85,
    'Duplex': 1.25,
    'Penthouse': 1.8
};

// -------------------------------
// Condition multipliers
// -------------------------------
const CONDITIONS = {
    'Excellent': 1.1,
    'Good': 1.0,
    'Average': 0.9,
    'Needs Renovation': 0.75
};

// -------------------------------
// Floor adjustments (apartments only)
// -------------------------------
function getFloorAdjustment(floor, hasElevator) {
    if (floor <= 0) return -0.05; // Ground floor or basement
    if (floor === 1) return 0; // First floor - baseline
    if (floor <= 3) return 0.03; // 2nd-3rd floor - slight premium
    if (floor <= 5) return 0.05; // 4th-5th floor - moderate premium
    return 0.08; // High floor with better views
}

// -------------------------------
// UNIFIED ESTIMATE FUNCTION
// -------------------------------
function unifiedEstimate(data) {
    // Validate required fields
    const city = (data.city || '').trim();
    const neighborhood = (data.neighborhood || '').trim();
    const surface = Number(data.surface) || 0;
    const propertyType = data.type || 'Apartment';
    const condition = data.condition || 'Good';
    const floor = Number(data.floor) || 1;
    const standing = data.standing || null;

    // Validation
    if (!city) {
        return { error: "City is required" };
    }
    if (!neighborhood) {
        return { error: "Neighborhood is required" };
    }
    if (surface <= 0) {
        return { error: "Surface area must be greater than 0" };
    }
    if (surface > 1000) {
        return { error: "Surface area seems too large. Please check your input" };
    }

    // Find city (case-insensitive)
    const cityKey = Object.keys(moroccoData).find(key => 
        key.toLowerCase() === city.toLowerCase()
    );

    let cityData;
    if (!cityKey) {
        // Use default city if not found
        cityData = moroccoData['DEFAULT_CITY'];
    } else {
        cityData = moroccoData[cityKey];
    }

    // Find neighborhood (case-insensitive, fuzzy match)
    const neighborhoodKey = Object.keys(cityData.neighborhoods).find(key =>
        key.toLowerCase().includes(neighborhood.toLowerCase()) ||
        neighborhood.toLowerCase().includes(key.toLowerCase())
    );

    let basePriceM2;
    let matchedNeighborhood;
    let standingLevel;

    if (neighborhoodKey) {
        // Found specific neighborhood
        const neighborhoodData = cityData.neighborhoods[neighborhoodKey];
        basePriceM2 = neighborhoodData.base_price_m2 || cityData.city_average_m2;
        standingLevel = neighborhoodData.standing || 'moyen';
        matchedNeighborhood = neighborhoodKey;
    } else {
        // Fallback to city average
        basePriceM2 = cityData.city_average_m2;
        standingLevel = 'moyen';
        matchedNeighborhood = 'City Average';
    }

    // Apply standing adjustment if not provided
    const standingFactor = standing ? 
        (STANDING_FACTORS[standing] || 1.0) : 
        STANDING_FACTORS[standingLevel];

    // Calculate base price
    let pricePerM2 = basePriceM2 * standingFactor;
    
    // Apply property type multiplier
    const typeMultiplier = PROPERTY_TYPES[propertyType] || 1.0;
    pricePerM2 *= typeMultiplier;

    // Apply condition multiplier
    const conditionMultiplier = CONDITIONS[condition] || 1.0;
    pricePerM2 *= conditionMultiplier;

    // Apply floor adjustment (for apartments, studios, duplexes, penthouses)
    if (['Apartment', 'Studio', 'Duplex', 'Penthouse'].includes(propertyType)) {
        const floorAdjustment = getFloorAdjustment(floor, data.hasElevator);
        pricePerM2 *= (1 + floorAdjustment);
    }

    // Calculate total price
    const totalPrice = pricePerM2 * surface;

    // Apply growth factor for future estimation
    const growthFactor = cityData.growth_factor || 1.0;
    const estimatedFuturePrice = totalPrice * growthFactor;

    return {
        success: true,
        city: cityKey || city,
        neighborhood: matchedNeighborhood,
        surface: surface,
        propertyType: propertyType,
        condition: condition,
        floor: floor,
        standing: standingLevel,
        pricePerM2: Math.round(pricePerM2),
        estimatedPrice: Math.round(totalPrice),
        estimatedPriceRange: {
            min: Math.round(totalPrice * 0.9),
            max: Math.round(totalPrice * 1.1)
        },
        estimatedFuturePrice: Math.round(estimatedFuturePrice),
        currency: 'MAD',
        disclaimer: 'This is an estimated value. Actual prices may vary based on market conditions, exact location, and property specifics.'
    };
}

module.exports = {
    unifiedEstimate
};