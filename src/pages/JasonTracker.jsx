import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import supabase from "../lib/supabase";

function JasonTracker() {
  const [weights, setWeights] = useState([]);
  const [todaysWeight, setTodaysWeight] = useState("");
  const [todaysWeightSubmitted, setTodaysWeightSubmitted] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*") 
        .in("username", ["jason"])

      if (error) {
        console.error("Error loading progress", error);
        return null;
      }

      const weights = [];
      data.forEach(({ date, weight }) => {
        if (weight) {
          weights.push({ date: date, weight: weight });
        }
      });

      const current = weights.find((entry) => entry.date === today) || {};
      console.log("today ", today);
      console.log(weights);
      const weight = current.weight || "";

      if (weight !== "") {
        setTodaysWeight(weight);
        setTodaysWeightSubmitted(true);
      }
      console.log(today, weight);
      setWeights(weights);
    };
    fetchData();
  }, []);

const formatDate = (dateString) => {
    const options = { year: "2-digit", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

  const TARGET_WEIGHT = 185;

  const maxDeviation = Math.max(
    ...weights.map(w => Math.abs(w.weight - TARGET_WEIGHT))
  );

  const getWeightColor = (weight) => {
    if (maxDeviation === 0) {
      return "hsl(120, 70%, 70%)"; // all green
    }
  
    const delta = weight - TARGET_WEIGHT;
    const t = Math.min(Math.abs(delta) / maxDeviation, 1);
  
    // Hue values:
    // 240 = blue
    // 120 = green
    // 0   = red
    const hue =
      delta < 0
        ? 120 + t * 120 // green → blue
        : 120 - t * 120; // green → red
  
    return `hsl(${hue}, 70%, 70%)`;
  };
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const handleWeightSubmission = async () => {
    if (todaysWeight.trim() === "") return;
    const updated = {
      ...progress,
      username,
      date: today,
      weight: todaysWeight,
    };
    setData({ jason: updated, gabby: otherProgress });
    setProgress(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["username", "date"] });

    if (error) {
      console.error("Error saving weight:", error);
    } else {
      alert("Weight submitted!");
      setTodaysWeightSubmitted(true);
    }
  }

  return (
    <div className="container w-2/3 mx-auto p-4">
              <button
        className="bg-jl-red w-full h-1/3 py-4 text-6xl font-semibold hover:bg-jl-red_hover cursor-pointer"
        onClick={() => navigate(`/tracker/jason`)}
      >
        Temp weight submission
      </button>
         <>
          {!todaysWeightSubmitted ?
            <div>
              <input
                type="text"
                value={todaysWeight}
                onChange={(e) => setTodaysWeight(e.target.value)}
                placeholder={`Submit today's weight`}
                className={`w-full p-2 border-2 border-jl-red rounded mt-2 bg-gray-800 text-white`}
              />
              <button
                onClick={() => handleWeightSubmission()}
                className={`mt-2 w-full bg-jl-red text-white py-2 rounded hover:bg-jl-red_hover cursor-pointer font-semibold`}
              >
                Submit
              </button>
            </div> :
            
            <div>
              <span className="text-jl-red font-semibold">
                  Today's weight: {todaysWeight} lbs
              </span>
            </div>
          }
        </>
      <div className="p-4 my-4 ring-2 rounded">
        <h3 className="text-2xl font-bold">Weight log:</h3>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sortedWeights.map(({ date, weight }) => (
            <li
            key={date}
            className="p-2 rounded text-black flex justify-between text-lg"
            style={{ backgroundColor: getWeightColor(weight) }}
            >
            <span>{formatDate(date)}:</span>
            <span className="font-bold">{weight}</span>
            </li>
        ))}
        </ul>
      </div>

    </div>
  );
}

export default JasonTracker;
