import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    navigate(`/tracker/${user.toLowerCase()}`);
  };

  const handleResultsClick = () => {
    navigate('/results');
  }

  const handleJasonClick = () => {
    navigate('/jason-tracker');
  }

  return (
    <div className="space-y-4 h-screen flex flex-col items-center justify-baseline text-white">
      <h1 className="text-3xl font-bold my-8 mx-8">The challenge has concluded! See final results:</h1>
      <button 
        className="bg-jl-red w-3/4 md:w-1/2 lg:w-1/3 h-1/4 py-4 text-4xl md:text-5xl lg:text-6xl font-semibold hover:bg-jl-red_hover cursor-pointer rounded-lg shadow-lg"
        onClick={() => handleResultsClick()}
      >
        Final Results
      </button>
      {/* <button 
        className="bg-gq-purple w-3/4 md:w-1/2 lg:w-1/3 h-1/4 py-4 text-4xl md:text-5xl lg:text-6xl font-semibold hover:bg-gq-purple_hover cursor-pointer rounded-lg shadow-lg"
        onClick={() => handleJasonClick()}
      >
        Jason's Tracker
      </button> */}
      {/* <h1 className="text-3xl font-bold my-8">Welcome! Who is this?</h1> */}
      {/* <button
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
      </button> */}
    </div>
  );
}
