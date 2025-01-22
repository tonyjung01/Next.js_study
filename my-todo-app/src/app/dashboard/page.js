'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabase'; // Supabase 클라이언트 가져오기
import TodoSection from '../../components/TodoSection'; // 할 일 섹션 컴포넌트 가져오기
import Navbar from '../../components/Navbar'; // Navbar 가져오기
import 'react-calendar/dist/Calendar.css';

// Calendar 컴포넌트를 동적으로 불러오기
const Calendar = dynamic(() => import('react-calendar'), {
    ssr: false, // 서버 사이드 렌더링 비활성화
});

const DashboardPage = () => {
    const [todos, setTodos] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateTodos, setSelectedDateTodos] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]); // 월별 통계 상태 추가

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(user);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTodos = async () => {
            if (!user) return;

            const { data: todos, error } = await supabase
                .from('todos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching todos:', error);
            } else {
                const incompleteTodos = todos.filter((todo) => !todo.is_completed);
                const completedTodos = todos.filter((todo) => todo.is_completed);
                setTodos(incompleteTodos);
                setCompleted(completedTodos);
            }
        };

        fetchTodos();
    }, [user]);

    // 선택된 날짜의 할 일 필터링
    useEffect(() => {
        if (!todos.length && !completed.length) return;

        const allTodos = [...todos, ...completed];
        const filteredTodos = allTodos.filter((todo) => {
            const todoDate = new Date(todo.created_at);
            return todoDate.toDateString() === selectedDate.toDateString();
        });

        setSelectedDateTodos(filteredTodos);
    }, [selectedDate, todos, completed]);

    // 완료율 계산
    const calculateCompletionRate = () => {
        const totalTodos = todos.length + completed.length;
        if (totalTodos === 0) return 0;
        return Math.round((completed.length / totalTodos) * 100);
    };

    // 월별 통계 가져오기
    useEffect(() => {
        const fetchMonthlyStats = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase.from('monthly_todo_stats').select('*').eq('user_id', user.id);

                if (error) throw error;

                setMonthlyStats(data);
            } catch (error) {
                console.error('Error fetching monthly stats:', error.message);
            }
        };

        fetchMonthlyStats();
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <Navbar />
            <h2 className="text-4xl font-bold mb-4 text-center">대시보드</h2>
            {user && <p className="text-lg mb-4">안녕하세요, {user.email}님!</p>}

            {/* 전체 통계 섹션 */}
            <div className="w-full max-w-4xl mb-6 bg-white shadow-md rounded-lg p-4">
                <h3 className="text-2xl font-bold mb-4">전체 통계</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-lg">총 할 일</p>
                        <p className="text-3xl font-bold">{todos.length + completed.length}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-lg">전체 완료율</p>
                        <p className="text-3xl font-bold">{calculateCompletionRate()}%</p>
                    </div>
                </div>
            </div>

            {/* 캘린더 섹션 */}
            <div className="w-full max-w-4xl mb-6 bg-white shadow-md rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            className="w-full rounded-lg"
                            tileClassName={({ date }) => {
                                const allTodos = [...todos, ...completed];
                                const hasTodos = allTodos.some(
                                    (todo) => new Date(todo.created_at).toDateString() === date.toDateString()
                                );
                                return hasTodos ? 'has-todos' : '';
                            }}
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-3">
                            {selectedDate.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                            의 할 일
                        </h4>
                        {selectedDateTodos.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedDateTodos.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg">{todo.text}</span>
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm ${
                                                    todo.is_completed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {todo.is_completed ? '완료' : '미완료'}
                                            </span>
                                        </div>
                                        {todo.description && (
                                            <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">이 날의 할 일이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 월별 통계 섹션 추가 */}
            <div className="mb-6 bg-white shadow-md rounded-lg p-4">
                <h3 className="text-2xl font-bold mb-4">월별 통계</h3>
                {monthlyStats.length > 0 ? (
                    <ul>
                        {monthlyStats.map((stat) => (
                            <li key={stat.month} className="text-lg">
                                {new Date(stat.month).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}:
                                총 할 일: <span className="font-bold">{stat.total_todos}</span>, 완료 할 일:{' '}
                                <span className="font-bold">{stat.completed_todos}</span>, 미완료 할 일:{' '}
                                <span className="font-bold">{stat.pending_todos}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg">월별 통계가 없습니다.</p>
                )}
            </div>

            <TodoSection todos={todos} setTodos={setTodos} completed={completed} setCompleted={setCompleted} />
        </div>
    );
};

export default DashboardPage;
