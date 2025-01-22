const TodoSection = ({ todos, completed, toggleTodoComplete, deleteTodo }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">할 일</h2>
            <ul className="mb-4 space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center flex-1">
                            <input
                                type="checkbox"
                                checked={todo.is_completed}
                                onChange={() => toggleTodoComplete(todo)}
                                className="w-4 h-4 mr-3 cursor-pointer"
                            />
                            <span className="select-none">{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo)} className="ml-2 px-3 py-1 text-red-600 hover:text-red-800 rounded-md">
                            삭제
                        </button>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">완료된 작업</h2>
            <ul className="space-y-2">
                {completed.map((todo) => (
                    <li key={todo.id} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center flex-1">
                            <input
                                type="checkbox"
                                checked={todo.is_completed}
                                onChange={() => toggleTodoComplete(todo)}
                                className="w-4 h-4 mr-3 cursor-pointer"
                            />
                            <span className="select-none line-through text-gray-500">{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo)} className="ml-2 px-3 py-1 text-red-600 hover:text-red-800 rounded-md">
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoSection;
