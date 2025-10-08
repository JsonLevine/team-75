import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    navigate(`/tracker/${user.toLowerCase()}`);
  };

  return (
    <div className="space-y-4 h-screen flex flex-col items-center justify-baseline bg-gray-900 text-white">
      <h1 className="text-3xl font-bold my-8">Welcome! Who is this?</h1>
      <button
        className="bg-jl-red w-full h-1/3 py-4 text-6xl font-semibold hover:bg-jl-red_hover cursor-pointer"
        onClick={() => handleSelect("jason")}
      >
        Jason
      </button>
      <button
        className="bg-gq-violet w-full h-1/3 py-4 text-6xl font-semibold hover:bg-gq-violet_hover cursor-pointer"
        onClick={() => handleSelect("gabby")}
      >
        Gabby
      </button>
    </div>
  );
}
