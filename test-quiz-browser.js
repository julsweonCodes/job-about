// 브라우저 개발자 도구 Console에서 실행할 테스트 코드

// 1. 퀴즈 질문 목록 조회
async function testGetQuestions() {
  console.log("=== 퀴즈 질문 조회 테스트 ===");
  try {
    const response = await fetch('/api/quiz');
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 2. 모든 프로필 조회
async function testGetAllProfiles() {
  console.log("=== 모든 프로필 조회 테스트 ===");
  try {
    const response = await fetch('/api/quiz/profiles');
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 3. 특정 프로필 조회
async function testGetProfile(id) {
  console.log(`=== 프로필 ${id} 조회 테스트 ===`);
  try {
    const response = await fetch(`/api/quiz/profiles/${id}`);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 4. 퀴즈 답변 제출 (로그인 필요)
async function testSubmitQuiz() {
  console.log("=== 퀴즈 제출 테스트 ===");
  const responses = [
    {"question_code": "Q1", "choice_label": "A"},
    {"question_code": "Q2", "choice_label": "B"},
    {"question_code": "Q3", "choice_label": "A"},
    {"question_code": "Q4", "choice_label": "A"},
    {"question_code": "Q5", "choice_label": "B"},
    {"question_code": "Q6", "choice_label": "A"}
  ];
  
  try {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses })
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 5. 내 프로필 조회 (로그인 필요)
async function testGetMyProfile() {
  console.log("=== 내 프로필 조회 테스트 ===");
  try {
    const response = await fetch('/api/quiz/my-profile');
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// 모든 테스트 실행
async function runAllTests() {
  console.log("🚀 퀴즈 API 테스트 시작");
  
  await testGetQuestions();
  await testGetAllProfiles();
  await testGetProfile(1);
  await testGetProfile(3);
  await testGetMyProfile(); // 로그인 안 되어 있으면 401 에러 예상
  await testSubmitQuiz();   // 로그인 안 되어 있으면 401 에러 예상
  
  console.log("✅ 모든 테스트 완료");
}

// 사용법:
// runAllTests(); 
// 또는 개별 함수 실행:
// testGetQuestions();
// testGetAllProfiles();