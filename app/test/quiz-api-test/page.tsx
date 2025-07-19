'use client';

import { useState } from 'react';

export default function QuizApiTestPage() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setResults(prev => [...prev, result]);
  };

  const testGetQuestions = async () => {
    try {
      const response = await fetch('/api/quiz');
      const data = await response.json();
      addResult(`GET /api/quiz: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`GET /api/quiz ERROR: ${error}`);
    }
  };

  const testPostQuiz = async () => {
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: [
            { questionId: 1, answer: 1 },
            { questionId: 2, answer: 2 },
            { questionId: 3, answer: 1 },
            { questionId: 4, answer: 2 },
            { questionId: 5, answer: 1 },
            { questionId: 6, answer: 2 }
          ]
        })
      });
      const data = await response.json();
      addResult(`POST /api/quiz: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`POST /api/quiz ERROR: ${error}`);
    }
  };

  const testGetMyProfile = async () => {
    try {
      const response = await fetch('/api/quiz/my-profile');
      const data = await response.json();
      addResult(`GET /api/quiz/my-profile: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addResult(`GET /api/quiz/my-profile ERROR: ${error}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quiz API 테스트</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testGetQuestions}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          GET /api/quiz (퀴즈 질문 조회)
        </button>
        
        <button 
          onClick={testPostQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          POST /api/quiz (퀴즈 제출 - 로그인 필요)
        </button>
        
        <button 
          onClick={testGetMyProfile}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          GET /api/quiz/my-profile (내 프로필 조회 - 로그인 필요)
        </button>
        
        <button 
          onClick={() => setResults([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          결과 초기화
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">테스트 결과:</h2>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500">아직 테스트 결과가 없습니다.</p>
          ) : (
            results.map((result, index) => (
              <pre key={index} className="text-sm mb-4 whitespace-pre-wrap">
                {result}
              </pre>
            ))
          )}
        </div>
      </div>
    </div>
  );
}