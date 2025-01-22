'use client';

import React from 'react';
import Navbar from '../../components/Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            {/* <Navbar /> */}
            <header className="mb-6">
                {/* <h1 className="text-3xl font-bold">대시보드</h1> */}
                {/* 여기에 네비게이션 바 또는 추가적인 헤더 내용을 추가할 수 있습니다. */}
            </header>
            <main className="flex-grow">{children}</main>
        </div>
    );
};

export default DashboardLayout;
