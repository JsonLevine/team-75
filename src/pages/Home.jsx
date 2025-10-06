import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    navigate(`/tracker/${user.toLowerCase()}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Team-75</h1>
      <div className="space-y-4">
        <button
          className="bg-blue-500 w-64 py-4 rounded-xl text-xl font-semibold hover:bg-blue-600"
          onClick={() => handleSelect("Zeus")}
        >
          Zeus
        </button>
        <button
          className="bg-pink-500 w-64 py-4 rounded-xl text-xl font-semibold hover:bg-pink-600"
          onClick={() => handleSelect("Hera")}
        >
          Hera
        </button>
      </div>
    </div>
  );
}
