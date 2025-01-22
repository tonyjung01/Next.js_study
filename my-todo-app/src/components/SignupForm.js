// src/components/SignupForm.js
import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Supabase 클라이언트 가져오기

const SignupForm = () => {
  const [email, setEmail] = useState(''); // 이메일 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [error, setError] = useState(null); // 오류 상태
  const [success, setSuccess] = useState(null); // 성공 메시지 상태

  // 회원가입 함수
  const handleSignup = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message); // 오류 메시지 설정
      setSuccess(null); // 성공 메시지 초기화
    } else {
      setSuccess('회원가입 성공! 확인 이메일을 확인하세요.'); // 성공 메시지 설정
      setError(null); // 오류 초기화
      setEmail(''); // 이메일 필드 초기화
      setPassword(''); // 비밀번호 필드 초기화
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">회원가입</h2>
      {error && <p className="text-red-500">{error}</p>} {/* 오류 메시지 표시 */}
      {success && <p className="text-green-500">{success}</p>} {/* 성공 메시지 표시 */}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          placeholder="이메일"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          placeholder="비밀번호"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupForm;