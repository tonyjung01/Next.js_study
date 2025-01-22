const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
      style={{ width: '60px', height: '60px' }}
    >
      +
    </button>
  );
};

export default FloatingButton; 