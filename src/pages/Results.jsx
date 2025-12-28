import { useState, useEffect } from 'react'

const startDate = new Date(2025, 9, 18); // Month is 0-indexed: 9 = October
const totalDays = 75;
const activityKeys = ["workout", "water", "meditation", "reading"];
const users = ["jason", "gabby"];
const data = [
    { username: 'jason', workout: 0, water: 0, meditation: 0, reading: 0 },
    { username: 'gabby', workout: 0, water: 0, meditation: 0, reading: 0 },
];

function Results() {

    const [results, setResults] = useState(data);
    const [isLoading, setIsLoading] = useState(false);


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
            setResults(data);
            setIsLoading(false);
          };
      
          fetchProgress();
    }, []);

  return (
    <div>
        <h1>Final Results:</h1>

    </div>
  )
}

export default Results