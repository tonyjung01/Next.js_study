const Modal = ({ isOpen, onClose, inputValue, setInputValue, addTodo }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">할 일 추가</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                    placeholder="할 일을 입력하세요"
                />
                <div className="flex justify-between">
                    <button
                        onClick={addTodo}
                        className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
                    >
                        추가
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400 transition"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
