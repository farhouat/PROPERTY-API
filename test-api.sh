#!/bin/bash

# Property Valuation API Test Script
# This script tests all major API endpoints

echo "🧪 Testing Property Valuation API..."
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Root endpoint
echo "📍 Test 1: Root Endpoint"
echo "-----------------------------------"
curl -s $BASE_URL | head -20
echo -e "\n"

# Test 2: Get all cities
echo "🏙️  Test 2: Get All Cities"
echo "-----------------------------------"
curl -s $BASE_URL/api/cities | python3 -m json.tool 2>/dev/null || curl -s $BASE_URL/api/cities
echo -e "\n"

# Test 3: Get neighborhoods for Casablanca
echo "🏘️  Test 3: Get Neighborhoods for Casablanca"
echo "-----------------------------------"
curl -s $BASE_URL/api/neighborhoods/Casablanca | python3 -m json.tool 2>/dev/null || curl -s $BASE_URL/api/neighborhoods/Casablanca
echo -e "\n"

# Test 4: Property estimate - Apartment in Casablanca
echo "💰 Test 4: Apartment in Casablanca (Maarif)"
echo "-----------------------------------"
curl -s -X POST $BASE_URL/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Casablanca",
    "neighborhood": "Maarif",
    "surface": 100,
    "type": "Apartment",
    "condition": "Good",
    "floor": 3
  }' | python3 -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/estimate -H "Content-Type: application/json" -d '{"city":"Casablanca","neighborhood":"Maarif","surface":100,"type":"Apartment","condition":"Good","floor":3}'
echo -e "\n"

# Test 5: Property estimate - Villa in Rabat
echo "🏡 Test 5: Villa in Rabat (Agdal)"
echo "-----------------------------------"
curl -s -X POST $BASE_URL/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Rabat",
    "neighborhood": "Agdal",
    "surface": 200,
    "type": "Villa",
    "condition": "Excellent",
    "floor": 2
  }' | python3 -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/estimate -H "Content-Type: application/json" -d '{"city":"Rabat","neighborhood":"Agdal","surface":200,"type":"Villa","condition":"Excellent","floor":2}'
echo -e "\n"

# Test 6: Property estimate - Studio in Marrakech
echo "🏢 Test 6: Studio in Marrakech (Guéliz)"
echo "-----------------------------------"
curl -s -X POST $BASE_URL/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Marrakech",
    "neighborhood": "Guéliz",
    "surface": 50,
    "type": "Studio",
    "condition": "Good",
    "floor": 1
  }' | python3 -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/estimate -H "Content-Type: application/json" -d '{"city":"Marrakech","neighborhood":"Guéliz","surface":50,"type":"Studio","condition":"Good","floor":1}'
echo -e "\n"

# Test 7: Error handling - Missing required fields
echo "❌ Test 7: Error Handling (Missing Fields)"
echo "-----------------------------------"
curl -s -X POST $BASE_URL/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Casablanca"
  }' | python3 -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/estimate -H "Content-Type: application/json" -d '{"city":"Casablanca"}'
echo -e "\n"

# Test 8: Unknown city (should use default)
echo "🌍 Test 8: Unknown City (Fallback Test)"
echo "-----------------------------------"
curl -s -X POST $BASE_URL/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "city": "UnknownCity",
    "neighborhood": "Test",
    "surface": 80,
    "type": "Apartment",
    "condition": "Average",
    "floor": 2
  }' | python3 -m json.tool 2>/dev/null || curl -s -X POST $BASE_URL/api/estimate -H "Content-Type: application/json" -d '{"city":"UnknownCity","neighborhood":"Test","surface":80,"type":"Apartment","condition":"Average","floor":2}'
echo -e "\n"

echo "✅ All tests completed!"
