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
        const fetchData = async () => {
            const { data, error } = await supabase.from("progress").select("*");

            if (error) {
              console.error("Error loading progress", error);
              return null;
            }
          
            const results = {};
          
            data.forEach(({ username, workout, water, meditation, reading }) => {
              if (!results[username]) {
                results[username] = { workout: 0, water: 0, meditation: 0, reading: 0 };
              }
          
              if (workout) results[username].workout++;
              if (water) results[username].water++;
              if (meditation) results[username].meditation++;
              if (reading) results[username].reading++;
            });

            setResults(results);
        }
        fetchData();
      }), [];

  return (
    <div>
        <h1>Final Results:</h1>

    </div>
  )
}

export default Results