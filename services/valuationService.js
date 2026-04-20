const nationalData = require('../data/morocco_valuation_dataset.json');
const localConfig = require('../config/valuation.json');
const Fuse = require('fuse.js');

// Arabic → French map (Casablanca only)
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

// Fuzzy matching helper
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
// NATIONAL ENGINE
// -------------------------------
function nationalEstimate(city, neighborhood, standing) {
    const cityData = nationalData[city] || nationalData["DEFAULT_CITY"];
    const growth = cityData.growth_factor || 1;

    const neighborhoodData =
        (cityData.neighborhoods && cityData.neighborhoods[neighborhood]) ||
        cityData.neighborhoods["DEFAULT_NEIGHBORHOOD"];

    const base = neighborhoodData.base_price_m2 || cityData.city_average_m2;

    const standingFactor =
        nationalData.FALLBACK_RULES.standing_adjustments[
            standing || neighborhoodData.standing
        ] || 1;

    const finalPrice = base * standingFactor * growth;

    return {
        engine: "national",
        city,
        neighborhood: neighborhood || "DEFAULT_NEIGHBORHOOD",
        standing: standing || neighborhoodData.standing,
        base_price_m2: base,
        growth_factor: growth,
        standing_factor: standingFactor,
        estimated_price_m2: Math.round(finalPrice)
    };
}

// -------------------------------
// CASABLANCA ENGINE
// -------------------------------
function casablancaEstimate(neighborhood, surface, type, condition, floor) {
    let n = neighborhood;

    // Arabic normalization
    if (arabicMap[n]) n = arabicMap[n];

    // Fuzzy matching
    const normalized = normalizeNeighborhood(n, localConfig.neighborhoods);
    if (!normalized) {
        return { error: "Unknown neighborhood" };
    }

    const basePrice = localConfig.neighborhoods[normalized];
    let typeFactor = localConfig.propertyTypes[type] || 1;

    // Villa premium
    if (type === "Villa" && localConfig.villaPremium?.[normalized]) {
        typeFactor *= localConfig.villaPremium[normalized];
    }

    const conditionFactor = localConfig.conditions[condition] || 1;
    const floorFactor = 1 + (floor * 0.01);

    const pricePerM2 = basePrice * typeFactor * conditionFactor * floorFactor;
    const estimatedPrice = Math.round(pricePerM2 * surface);

    const vol = localConfig.volatility?.[normalized] || 0.1;

    return {
        engine: "casablanca",
        neighborhood: normalized,
        pricePerM2: Math.round(pricePerM2),
        estimatedPrice,
        confidence: {
            low: Math.round(estimatedPrice * (1 - vol)),
            high: Math.round(estimatedPrice * (1 + vol))
        },
        range: localConfig.ranges?.[normalized] || null
    };
}

// -------------------------------
// UNIFIED ENGINE
// -------------------------------
function unifiedEstimate(params) {
    const { city, neighborhood } = params;

    if (!city || city.toLowerCase() === "casablanca") {
        return casablancaEstimate(
            params.neighborhood,
            params.surface,
            params.type,
            params.condition,
            params.floor
        );
    }

    return nationalEstimate(
        city,
        neighborhood,
        params.standing
    );
}

module.exports = { unifiedEstimate };