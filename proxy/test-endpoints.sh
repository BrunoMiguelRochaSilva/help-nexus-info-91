#!/bin/bash

# Test Endpoints for Rare Help Proxy Server
# Usage: bash test-endpoints.sh

echo "========================================="
echo "Testing Rare Help Proxy Server Endpoints"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3001"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET $BASE_URL/status"
echo ""
curl -s "$BASE_URL/status" | jq '.'
echo ""
echo "---"
echo ""

# Test 2: Orphadata Search (Albinism)
echo -e "${YELLOW}Test 2: Orphadata Search - Albinism${NC}"
echo "GET $BASE_URL/api/orpha/albinism"
echo ""
curl -s "$BASE_URL/api/orpha/albinism" | jq '.'
echo ""
echo "---"
echo ""

# Test 3: Orphadata Search (Not Found)
echo -e "${YELLOW}Test 3: Orphadata Search - Invalid Term${NC}"
echo "GET $BASE_URL/api/orpha/zzzzinvalid"
echo ""
curl -s "$BASE_URL/api/orpha/zzzzinvalid" | jq '.'
echo ""
echo "---"
echo ""

# Test 4: Chat Request (Non-streaming)
echo -e "${YELLOW}Test 4: Chat Request - What is Hemophilia?${NC}"
echo "POST $BASE_URL/chat"
echo ""
curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is hemophilia?",
    "anonymousId": "test-user-123"
  }'
echo ""
echo "---"
echo ""

# Test 5: Chat Request with SSE Streaming
echo -e "${YELLOW}Test 5: Chat Request (SSE Streaming) - Cystic Fibrosis${NC}"
echo "POST $BASE_URL/chat (streaming)"
echo ""
curl -N -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "message": "Tell me about cystic fibrosis in one sentence",
    "anonymousId": "test-user-456"
  }'
echo ""
echo "---"
echo ""

# Test 6: Rate Limiting (send multiple requests)
echo -e "${YELLOW}Test 6: Rate Limiting Test${NC}"
echo "Sending 5 rapid requests..."
for i in {1..5}
do
  echo "Request $i:"
  curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/chat" \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"Test message $i\",
      \"anonymousId\": \"rate-limit-test\"
    }"
  echo ""
done
echo ""
echo "---"
echo ""

# Test 7: Invalid Request (Validation)
echo -e "${YELLOW}Test 7: Input Validation - Empty Message${NC}"
echo "POST $BASE_URL/chat (invalid)"
echo ""
curl -s -X POST "$BASE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "anonymousId": "test-invalid"
  }' | jq '.'
echo ""
echo "---"
echo ""

echo -e "${GREEN}All tests completed!${NC}"
echo ""
echo "Check logs with: docker-compose logs -f proxy"
