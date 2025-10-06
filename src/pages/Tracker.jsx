import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabase";

const activities = [
  { key: "workout", label: "45 minute workout" },
  { key: "protein", label: "50-100 grams of protein" },
  { key: "meditation", label: "10 minutes of meditation" },
  { key: "reading", label: "10 Pages of reading" },
];

export default function Tracker() {
  const { username } = useParams();
  const [progress, setProgress] = useState({});
  const [otherProgress, setOtherProgress] = useState({});
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const otherUser = username === "jason" ? "gabby" : "jason";

  const userColor = username === "jason" ? "jl-red" : "gq-violet";
  const userLightColor = username === "jason" ? "jl-red_hover" : "gq-violet_hover";
    const userSuccessColor = username === "jason" ? "jl-orange" : "gq-purple";
    const userFailColor = username === "jason" ? "jl-yellow_hover" : "gq-blue";

  const otherUserColor = otherUser === "jason" ? "jl-red" : "gq-violet";
  const otherUserLightColor = otherUser === "jason" ? "jl-red_hover" : "gq-violet_hover";

  const userGradient = username === "jason" ? 
    "bg-linear-to-r from-jl-red from-40% to-gq-violet" : 
    "bg-linear-to-r from-gq-violet from-40% to-jl-red";
 
  // Fetch today's progress for both users
  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .in("username", [username, otherUser])
        .eq("date", today);

      if (error) {
        console.error(error);
        return;
      }

      const current = data.find((row) => row.username === username) || {};
      const other = data.find((row) => row.username === otherUser) || {};

      setProgress(current);
      setOtherProgress(other);
    };

    fetchProgress();
  }, [username]);

  // Handle toggling a slider for the current user
  const handleToggle = async (key) => {
    const updated = { ...progress, username, date: today, [key]: !progress[key] };
    setProgress(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["username", "date"] });

    if (error) {
      console.error("Error saving progress:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{username}'s Tracker</h1>

      <h2 className="text-xl font-semibold mb-2">Your progress for the day</h2>
      <div className="space-y-2 mb-6">
        {activities.map((act) => (
          <label key={act.key} 
          className={`
            ${progress[act.key] ? `bg-${userColor}` : ""}
            ${otherProgress[act.key] && !progress[act.key] ? `bg-${otherUserLightColor} text-black line-through opacity-70` : ""}
            ${'flex items-center justify-between border border-white p-2 rounded'}
        `}
          >
            <span>{act.label}</span>
            <button
                type="button"
                onClick={() => handleToggle(act.key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none
                ${progress[act.key] ? `bg-${userSuccessColor} justify-end` : `bg-${userFailColor} justify-start`}`}
            >
        <div className="w-4 h-4 bg-white rounded-full shadow-md transform duration-300" />
      </button>
          </label>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Team's progress for the day</h2>
      <div className="space-y-2">
        {activities.map((act) => (
          <label key={act.key} 
          className={` 
            ${otherProgress[act.key] && progress[act.key] ? userGradient : ""} 
            ${progress[act.key] && !otherProgress[act.key] ? `bg-${userLightColor} text-black` : ""}
            ${otherProgress[act.key] && !progress[act.key] ? `bg-${otherUserLightColor} text-black` : ""}
            ${`flex items-center justify-between border border-white p-2 rounded opacity-80`}
       `}
          >
            <span>{act.label}</span>
            {/* <input type="checkbox" checked={otherProgress[act.key] || false} disabled /> */}
            <span>{otherProgress[act.key] || progress[act.key] ? <strong>Completed!</strong> : "Incomplete"}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
