import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const activities = [
  { key: "workout", label: "45 Minute Workout" },
  { key: "protein", label: "50–100g of Protein" },
  { key: "meditation", label: "10 Minutes of Meditation" },
  { key: "reading", label: "Read 10 Pages" },
];

export default function Tracker() {
  const { user } = useParams();
  const [todayData, setTodayData] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchToday = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user", user)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") console.error(error);
      if (data) setTodayData(data);
    };
    fetchToday();
  }, [user, today]);

  const toggleActivity = async (key) => {
    const updated = { ...todayData, [key]: !todayData[key], user, date: today };

    setTodayData(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["user", "date"] });

    if (error) console.error("Error updating:", error);
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col items-center pt-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user}</h2>

      <div className="space-y-4 w-full max-w-sm">
        {activities.map(({ key, label }) => (
          <div
            key={key}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <span>{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!todayData[key]}
                onChange={() => toggleActivity(key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500"></div>
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  todayData[key] ? "translate-x-5" : ""
                }`}
              ></span>
            </label>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-8">
        Progress automatically saves to Supabase
      </p>
    </div>
  );
}
