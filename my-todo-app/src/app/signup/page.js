'use client';

import SignupForm from '../../components/SignupForm';
import Navbar from '../../components/Navbar';

const SignupPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6">회원가입</h1>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
