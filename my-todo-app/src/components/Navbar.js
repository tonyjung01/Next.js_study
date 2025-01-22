import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.getSession();
        session.then(({ data }) => {
            setUser(data.session?.user);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <nav className="w-full bg-white shadow-md rounded-lg mb-6 max-w-md mx-auto">
            <div className="flex justify-around p-4">
                <Link href="/" className="text-black hover:text-blue-600 transition">
                    홈
                </Link>
                <Link href="/dashboard" className="text-black hover:text-blue-600 transition">
                    대시보드
                </Link>
                {!user ? (
                    <>
                        <Link href="/signup" className="text-black hover:text-blue-600 transition">
                            회원가입
                        </Link>
                        <Link href="/login" className="text-black hover:text-blue-600 transition">
                            로그인
                        </Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="text-black hover:text-blue-600 transition">
                        로그아웃
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
