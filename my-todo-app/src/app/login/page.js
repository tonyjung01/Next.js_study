'use client';

import SignIn from '../../components/SignIn'; // SignIn 컴포넌트 가져오기
import Navbar from '../../components/Navbar'; // 네비게이션 바 컴포넌트 가져오기

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6">로그인</h1>
            <SignIn /> {/* SignIn 컴포넌트 추가 */}
        </div>
    );
};

export default LoginPage;
