import { useState, useEffect } from "react";
import supabase from "../lib/supabase";

const startDate = new Date(2025, 9, 18); // Month is 0-indexed: 9 = October
const totalDays = 75;
const activityKeys = ["workout", "water", "meditation", "reading"];
const users = ["jason", "gabby"];

// Generate array of 75 sequential dates
const days = Array.from({ length: totalDays }, (_, i) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  return date
    .toLocaleString("en-US", { timeZone: "America/New_York" })
    .split(",")[0]; // YYYY-MM-DD
});

const today = new Date()
  .toLocaleString("en-US", { timeZone: "America/New_York" })
  .split(",")[0];

export default function Calendar() {
  const [progressData, setProgressData] = useState([]);
  const [dayProgress, setDayProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [distinctCompletedCount, setDistinctCompletedCount] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchProgress = async () => {
      const { data, error } = await supabase.from("progress").select("*");
      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      const progressMap = {};
      const distinctCompleted = {};

      days.forEach((day) => {
        // Count how many activities have been completed by both users individually (max 8)
        let completedCount = 0;
        const completedActivities = new Set();
        users.forEach((user) => {
          activityKeys.forEach((activity) => {
            const estDate = new Date(
              new Date(day).toLocaleString("en-US", {
                timeZone: "America/New_York",
              })
            );
            if (
              users.some((u) => {
                const row = data.find(
                  (r) =>
                    r.username === u &&
                    r.date === estDate.toISOString().split("T")[0]
                );
                return row && row[activity];
              })
            ) {
              completedActivities.add(activity);
            }
            const formattedDay = estDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
            const row = data.find(
              (r) => r.username === user && r.date === formattedDay
            );
            if (row && row[activity]) completedCount++;
          });
        });
        progressMap[day] = completedCount;
        distinctCompleted[day] = completedActivities.size;
      });
      setDistinctCompletedCount(distinctCompleted);
      setDayProgress(progressMap);
      setProgressData(data);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setIsLoading(false);
    };

    fetchProgress();
  }, []);

  const getColor = (count) => {
    switch (count) {
      case -1: // missed day
        return "bg-gray-200 text-gray-700 border-2 border-red-400";
      case 0:
        return "bg-gray-200 text-gray-700";
      case 1:
        return "bg-linear-to-t from-orange-500 from-10% to-gray-200 to-30% text-black border-2 border-orange-400";
      case 2:
        return "bg-linear-to-t from-yellow-500 from-40% to-gray-200 to-60% text-black border-2 border-yellow-400";
      case 3:
        return "bg-linear-to-t from-blue-500 from-60% to-gray-200 to-80% text-white border-2 border-blue-400";
      case 4:
      case 5:
      case 6:
      case 7:
        return "bg-green-500 text-white font-bold border-2 border-green-400";
      case 8:
        return "bg-linear-to-r from-gq-violet to-jl-red text-white font-bold border-2 border-gq-violet border-t-jl-red border-r-jl-red";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const handleDayClick = async (day) => {
    const estDate = new Date(
      new Date(day).toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    );

    const formattedDay = estDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    // Prevent clicking future days
    if (new Date(formattedDay) > new Date(today)) return;

    setSelectedDay(formattedDay);
    setDayDetails(progressData.filter((p) => p.date === formattedDay));
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Team Combined Progress
        </h1>
        <div className="grid grid-cols-7 gap-1 animate-[drawCalendar_1s_ease-in-out_forwards]">
          {days.map((day, i) => {
            const date = new Date(day);
            const monthNum = date.getMonth();
            const dayNum = date.getDate();
            return (
              <div
                key={i}
                className={`${
                  i === 0 ? "col-start-7" : ""
                } w-full h-10 bg-gray-200 flex items-center justify-center text-gray-800 rounded opacity-0 animate-[fadeInCell_0.8s_ease-in-out_forwards]`}
                style={{ animationDelay: `${i * 0.01}s` }}
              >
                {monthNum + 1}/{dayNum}
              </div>
            );
          })}
        </div>
        <style>
          {`
						@keyframes drawCalendar {
							0% { opacity: 0; transform: scale(0.95); }
							100% { opacity: 1; transform: scale(1); }
						}
						@keyframes fadeInCell {
							0% { opacity: 0; transform: scale(0.7); }
							100% { opacity: 1; transform: scale(1); }
						}
					`}
        </style>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Team Combined Progress
      </h1>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          let count = dayProgress[day] || 0;
          let distinctCount =
            count == 8 ? count : distinctCompletedCount[day] || 0;
          const date = new Date(day);
          if (date < new Date(today) && distinctCount === 0) {
            distinctCount = -1;
          }
          const monthNum = date.getMonth();
          const dayNum = date.getDate();
          return (
            <div
              onClick={() => handleDayClick(day)}
              key={day}
              className={`
								${index === 0 ? "col-start-7" : ""} 
								${day === today ? "underline" : ""}
								${new Date(day) > new Date(today) ? "cursor-not-allowed" : "cursor-pointer"}
								 w-full h-10 flex items-center justify-center rounded ${getColor(
                   distinctCount
                 )}`}
              title={`${day} — ${
                distinctCount < 0 ? 0 : distinctCount
              }/4 activities`} //Makes the tooltip show 0 if count is -1
            >
              {monthNum + 1}/{dayNum}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setSelectedDay(null)} // closes when clicking outside
        >
          <div
            className={`${getColor(distinctCompletedCount)} w-10/12 rounded-2xl p-4 shadow-lg`}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className="text-lg text-gray-500 font-bold mb-2 text-center">
              {selectedDay}
            </h2>

            {dayDetails ? (
              <div className="space-y-2">
                {activityKeys.map((activity) => {
                  const activityName =
                    activity.charAt(0).toUpperCase() + activity.slice(1);
                  const completedBy = dayDetails
                    .filter((d) => d[activity])
                    .map(
                      (d) =>
                        d.username.charAt(0).toUpperCase() + d.username.slice(1)
                    )
                    .join(" and ");
                  return (
                    <div
                      key={activity}
                      className={`
												${
													completedBy.length > 5
														? "bg-gradient-to-r from-gq-violet to-jl-red text-white font-bold"
														: completedBy === "Jason"
														? "bg-jl-red_hover text-black"
														: completedBy === "Gabby"
														? "bg-gq-purple text-black"
														: ""
												}
												flex justify-between items-center p-3 rounded-lg`}
                    >
                      {completedBy ? (
                        <>
                          <span className="text-sm">
                            {activityName} completed by:
                          </span>

                          <span

                          >
                            {completedBy ? `${completedBy.length > 5 ? "Everyone" : completedBy}` : ""}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-gray-500">
                            {activityName} not completed 
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading...</p>
            )}

            <button
              className="mt-4 w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setSelectedDay(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
