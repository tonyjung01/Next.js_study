'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import TodoSection from '../components/TodoSection';
import FloatingButton from '../components/FloatingButton';
import Modal from '../components/Modal';

export default function Home() {
    const [todos, setTodos] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    // ✅ 현재 로그인한 사용자 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(session?.user);
            }
        };

        fetchUser();
    }, []);

    // ✅ Supabase에서 할 일 목록 가져오기
    const fetchTodos = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            setTodos(data.filter((todo) => !todo.is_completed));
            setCompleted(data.filter((todo) => todo.is_completed));
        } catch (error) {
            console.error('❌ 할 일 목록을 가져오는 중 오류 발생:', error.message);
        }
    };

    // ✅ 페이지 로딩 시 할 일 목록 불러오기 + 실시간 변경 감지 (중복 실행 방지)
    useEffect(() => {
        fetchTodos();

        const subscription = supabase
            .channel('todos')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'todos' }, (payload) => {
                console.log('🔄 Supabase 변경 감지:', payload);
                fetchTodos();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user]);

    // ✅ 체크박스 클릭 시 UI와 Supabase 동기화
    const toggleTodoComplete = async (todo) => {
        if (!user) return;

        try {
            const newIsCompleted = !todo.is_completed;

            console.log(`🔄 업데이트 요청: id=${todo.id}, is_completed=${newIsCompleted}`);

            // ✅ Supabase 데이터 업데이트 요청
            const { data, error } = await supabase
                .from('todos')
                .update({ is_completed: newIsCompleted })
                .eq('id', todo.id)
                .select();

            if (error) {
                console.error('❌ Supabase 업데이트 오류:', error.message);
                return;
            }

            console.log('✅ Supabase 업데이트 성공:', data);

            if (data && data.length > 0) {
                const updatedTodo = data[0];

                // ✅ UI 상태 직접 업데이트 (fetchTodos() 사용하지 않음)
                setTodos((prevTodos) => prevTodos.filter((t) => t.id !== updatedTodo.id));
                setCompleted((prevCompleted) => prevCompleted.filter((t) => t.id !== updatedTodo.id));

                if (updatedTodo.is_completed) {
                    setCompleted((prevCompleted) => [...prevCompleted, updatedTodo]);
                } else {
                    setTodos((prevTodos) => [...prevTodos, updatedTodo]);
                }
            }
        } catch (error) {
            console.error('❌ 할 일 상태 업데이트 중 오류 발생:', error.message);
        }
    };

    const addTodo = async () => {
        if (!inputValue) return; // 입력값이 없으면 추가하지 않음

        try {
            const { data, error } = await supabase
                .from('todos')
                .insert([{ text: inputValue, user_id: user.id, is_completed: false }])
                .select();

            if (error) throw error;

            setTodos((prevTodos) => [...prevTodos, data[0]]);
            setInputValue(''); // 입력값 초기화
            setIsModalOpen(false); // 모달 닫기
        } catch (error) {
            console.error('❌ 할 일 추가 중 오류 발생:', error.message);
        }
    };

    // ✅ 할 일 삭제 함수
    const deleteTodo = async (todo) => {
        if (!user) return;

        try {
            const { error } = await supabase.from('todos').delete().eq('id', todo.id);

            if (error) {
                console.error('❌ 할 일 삭제 중 오류 발생:', error.message);
                return;
            }

            // UI 상태 업데이트
            setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
            setCompleted((prevCompleted) => prevCompleted.filter((t) => t.id !== todo.id));
        } catch (error) {
            console.error('❌ 할 일 삭제 중 오류 발생:', error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6">할 일 목록</h1>
            {user && <p>안녕하세요, {user.email}님!</p>}

            <TodoSection
                todos={todos}
                completed={completed}
                toggleTodoComplete={toggleTodoComplete}
                deleteTodo={deleteTodo}
            />
            <FloatingButton onClick={() => setIsModalOpen(true)} />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                inputValue={inputValue}
                setInputValue={setInputValue}
                addTodo={addTodo}
            />
        </div>
    );
}
