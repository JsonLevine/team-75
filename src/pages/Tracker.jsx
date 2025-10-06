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

  const otherUser = username === "zeus" ? "hera" : "zeus";

  const userColor = username === "zeus" ? "bg-jl-red" : "bg-gq-violet";
  const userLightColor = username === "zeus" ? "bg-jl-red_hover" : "bg-gq-violet_hover";
  const otherUserColor = otherUser === "zeus" ? "bg-jl-red" : "bg-gq-violet";
  const otherUserLightColor = otherUser === "zeus" ? "bg-jl-red" : "bg-gq-violet_hover";
 
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

      <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
      <div className="space-y-2 mb-6">
        {activities.map((act) => (
          <label key={act.key} 
          className={`
            ${progress[act.key] ? userColor : ""}
            ${otherProgress[act.key] && !progress[act.key] ? `${otherUserLightColor} text-black line-through opacity-70` : ""}
            ${'flex items-center justify-between border border-white p-2 rounded'}
        `}
          >
            <span>{act.label}</span>
            <input
              type="checkbox"
              checked={progress[act.key] || false}
              onChange={() => handleToggle(act.key)}
            />
          </label>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">{otherUser}'s Progress</h2>
      <div className="space-y-2">
        {activities.map((act) => (
          <label key={act.key} 
          className={` 
            ${otherProgress[act.key] ? otherUserColor : ""}
            ${progress[act.key] && !otherProgress[act.key] ? `${userLightColor} text-black line-through` : ""}
            ${`flex items-center justify-between border border-white p-2 rounded opacity-80`}
       `}
          >
            <span>{act.label}</span>
            <input type="checkbox" checked={otherProgress[act.key] || false} disabled />
          </label>
        ))}
      </div>
    </div>
  );
}
