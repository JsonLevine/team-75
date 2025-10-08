import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabase";

const activities = [
  { key: "workout", label: "45 minute workout" },
  { key: "protein", label: "50-100 grams of protein" },
  { key: "meditation", label: "10 minutes of meditation" },
  { key: "reading", label: "10 Pages of reading" },
];

function capitalizeFirstLetter(str) {
  if (typeof str !== "string" || str.length === 0) {
    return str; // Handle empty strings or non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Tracker() {
  const { username } = useParams();
  const [progress, setProgress] = useState({});
  const [otherProgress, setOtherProgress] = useState({});
	const [isLoading, setIsLoading] = useState(true);
  const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  const legibleDate = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const otherUser = username === "jason" ? "gabby" : "jason";

  const userColor = username === "jason" ? "jl-red" : "gq-violet";
  const userLightColor =
    username === "jason" ? "jl-red_hover" : "gq-violet_hover";
  const userSuccessColor = username === "jason" ? "jl-orange" : "gq-purple";
  const userFailColor = username === "jason" ? "jl-yellow_hover" : "gq-blue";

  const otherUserSuccessColor =
    username === "jason" ? "gq-purple" : "jl-orange";
  const otherUserFailColor =
    username === "jason" ? "gq-blue" : "jl-yellow_hover";
  const otherUserColor = username === "jason" ? "gq-violet" : "jl-red";
  const otherUserLightColor =
    username === "jason" ? "gq-violet_hover" : "jl-red_hover";

  const userGradient =
    username === "jason"
      ? "bg-linear-to-r from-jl-red from-40% to-gq-violet"
      : "bg-linear-to-r from-gq-violet from-40% to-jl-red";

  const userTextColor = username === "jason" ? "text-jl-red" : "text-gq-purple";
  const otherUserTextColor =
    username === "jason" ? "text-gq-purple" : "text-jl-red";

  // Fetch today's progress for both users
  useEffect(() => {
    setIsLoading(true);
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .in("username", [username, otherUser])
        .eq("date", today);

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      const current = data.find((row) => row.username === username) || {};
      const other = data.find((row) => row.username === otherUser) || {};

      setProgress(current);
      setOtherProgress(other);
      setIsLoading(false);
    };
    fetchProgress();
  }, [username]);

  // Handle toggling a slider for the current user
  const handleToggle = async (key) => {
    const updated = {
      ...progress,
      username,
      date: today,
      [key]: !progress[key],
    };
		console.log("Updating progress:", updated);
    setProgress(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["username", "date"] });

    if (error) {
      console.error("Error saving progress:", error);
    }
  };

	if (isLoading) {
		return (
			<div className="flex mt-60 justify-center h-screen">
				<div className="animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-t-gq-purple border-b-jl-red"></div>
			</div>
		);
	}

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1
        className={`${`${userTextColor}`} border border-white rounded-3xl p-5 text-2xl font-bold mb-4`}
      >
        {capitalizeFirstLetter(username)}'s Tracker for
        <br /> <strong className={otherUserTextColor}>{legibleDate}</strong>
      </h1>

      <h2 className="text-xl font-semibold mb-2"><strong className={userTextColor}>Your</strong> progress for the day</h2>
      <div className="space-y-2 mb-6">
        {activities.map((act) => (
          <label
            key={act.key}
            className={`
            ${progress[act.key] ? `bg-${userColor}` : ""}
            ${
              otherProgress[act.key] && !progress[act.key]
                ? `bg-${otherUserLightColor} text-black line-through opacity-70`
                : ""
            }
            ${"flex items-center justify-between border border-white p-2 rounded"}
        `}
          >
            <span>{act.label}</span>
            <button
              type="button"
              onClick={() => handleToggle(act.key)}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 focus:outline-none
                ${
                  progress[act.key]
                    ? `bg-${userSuccessColor} justify-end`
                    : otherProgress[act.key]
                    ? `bg-${otherUserFailColor} justify-start`
                    : `bg-${userFailColor} justify-start`
                }
                `}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform duration-300" />
            </button>
          </label>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        Team's progress for the day
      </h2>
      <div className="space-y-2">
        {activities.map((act) => (
          <label
            key={act.key}
            className={` 
            ${otherProgress[act.key] && progress[act.key] ? `${userGradient} font-bold` : ""} 
            ${
              progress[act.key] && !otherProgress[act.key]
                ? `bg-${userLightColor} text-black`
                : ""
            }
            ${
              otherProgress[act.key] && !progress[act.key]
                ? `bg-${otherUserLightColor} text-black`
                : ""
            }
            ${`flex items-center justify-between border border-white p-2 rounded opacity-80`}
       `}
          >
            <span>{act.label}</span>
            <span>
              {otherProgress[act.key] || progress[act.key] ? (
                <strong>Completed!</strong>
              ) : (
                "Incomplete"
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
