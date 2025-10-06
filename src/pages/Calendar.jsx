import { useState, useEffect } from "react";
import supabase from "../lib/supabase";

const startDate = new Date(2025, 9, 5); // Month is 0-indexed: 9 = October
const totalDays = 75;
const activityKeys = ["workout", "protein", "meditation", "reading"];
const users = ["jason", "gabby"];

// Generate array of 75 sequential dates
const days = Array.from({ length: totalDays }, (_, i) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
});

export default function Calendar() {
    const [dayProgress, setDayProgress] = useState({}); // { "2025-10-18": 3, ... }

    useEffect(() => {
      const fetchProgress = async () => {
        const { data, error } = await supabase.from("progress").select("*");
        if (error) {
          console.error(error);
          return;
        }
  
        const progressMap = {};
  
        days.forEach((day) => {
          // Count how many activities have been completed by either user
          let completedCount = 0;
          activityKeys.forEach((activity) => {
            const done = users.some((user) => {
              const row = data.find((r) => r.username === user && r.date === day);
              return row && row[activity];
            });
            if (done) completedCount++;
          });
          progressMap[day] = completedCount;
        });
  
        setDayProgress(progressMap);
      };
  
      fetchProgress();
    }, []);
  
    const getColor = (count) => {
      switch (count) {
        case 0:
          return "bg-gray-200 text-gray-700";
        case 1:
          return "bg-linear-to-t from-orange-400 from-10% to-white to-30% text-black";
        case 2:
          return "bg-linear-to-t from-yellow-400 from-40% to-white to-60% text-black";
        case 3:
          return "bg-linear-to-t from-blue-400 from-60% to-white to-80% text-black";
        case 4:
          return "bg-green-500 text-white text-bold";
        default:
          return "bg-gray-200 text-gray-700";
      }
    };
  
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Team-75 Combined Progress</h1>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const count = dayProgress[day] || 0;
            const date = new Date(day);
            const monthNum = date.getMonth();
            const dayNum = date.getDate();
            return (
              <div
                key={day}
                className={`w-full h-10 flex items-center justify-center rounded ${getColor(
                  count
                )}`}
                title={`${day} — ${count}/4 activities`}
              >
                {monthNum+1}/{dayNum+1}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  