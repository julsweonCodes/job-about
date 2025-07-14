#!/bin/bash

# 퀴즈 API 테스트 스크립트
BASE_URL="http://localhost:3000"

echo "=== 퀴즈 API 테스트 시작 ==="

echo ""
echo "1. 퀴즈 질문 목록 조회 (GET /api/quiz)"
curl -X GET "$BASE_URL/api/quiz" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "2. 모든 성향 프로필 목록 조회 (GET /api/quiz/profiles)"
curl -X GET "$BASE_URL/api/quiz/profiles" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "3. 특정 성향 프로필 조회 (GET /api/quiz/profiles/1)"
curl -X GET "$BASE_URL/api/quiz/profiles/1" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "4. 퀴즈 답변 제출 테스트 (POST /api/quiz) - 인증 없이"
curl -X POST "$BASE_URL/api/quiz" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"question_code": "Q1", "choice_label": "A"},
      {"question_code": "Q2", "choice_label": "B"},
      {"question_code": "Q3", "choice_label": "A"},
      {"question_code": "Q4", "choice_label": "A"},
      {"question_code": "Q5", "choice_label": "B"},
      {"question_code": "Q6", "choice_label": "A"}
    ]
  }' \
  | jq '.'

echo ""
echo "5. 내 프로필 조회 테스트 (GET /api/quiz/my-profile) - 인증 없이"
curl -X GET "$BASE_URL/api/quiz/my-profile" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "=== 테스트 완료 ==="