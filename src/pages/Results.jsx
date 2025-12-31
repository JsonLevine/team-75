import { useState, useEffect } from 'react'
import supabase from "../lib/supabase";


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

      function getActivityDisplay(activity, count){
        if (count > 0) {
            switch(activity) {
                case 'workout':
                    activity = 'Workouts';
                    break;
                case 'water':
                    activity = 'Water Intake';
                    break;
                case 'meditation':
                    activity = 'Meditation Sessions';
                    break;
                case 'reading':
                    activity = 'Reading Sessions';
                    break;
                default:
                    break;
            }
            return <li key={activity} className="text-jl-orange odd:text-gq-purple flex flex-row justify-between text-2xl"><span>{activity}:</span> <span>{count}</span></li>;
        }
        return null;
      }
      function getCombinedActivityDisplay(activity, count){
        if (count > 0) {
            switch(activity) {
                case 'workout':
                    return <li key={activity} className="text-jl-orange odd:text-gq-purple justify-between text-2xl">Completed <span className="font-bold underline">{count}</span> workouts</li>;
                case 'water':
                    return <li key={activity} className="text-jl-orange odd:text-gq-purple justify-between text-2xl">Drank over <span className="font-bold underline">{count/2}</span> gallons of water</li>;
                case 'meditation':
                    return <li key={activity} className="text-jl-orange odd:text-gq-purple justify-between text-2xl">Meditated for <span className="font-bold underline">{Math.round(count/6)}</span> hours</li>;
                case 'reading':
                    return <li key={activity} className="text-jl-orange odd:text-gq-purple justify-between text-2xl">Read for over <span className="font-bold underline">{Math.round(count/6)}</span> hours</li>;
                default:
                    break;
            }
            return <li key={activity} className="text-jl-orange odd:text-gq-purple flex flex-row justify-between text-2xl">{activity}: {count}</li>;
        }
        return null;
      }
  return (
    <div className="container sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto p-4">
        <h1 className="font-bold text-5xl">Final Results:</h1>
        <h2 className="font-bold text-4xl mt-4">Combined:</h2>
        <div className="p-4 my-4 ring-2 rounded">
            <h3 className="text-2xl font-bold">Together, you...</h3>
            <ul className="">
                {Object.entries(results).reduce((acc, [username, activities]) => {
                    Object.entries(activities).forEach(([activity, count]) => {
                        const existing = acc.find(item => item.key === activity);
                        if (existing) {
                            existing.count += count;
                        } else {
                            acc.push({ key: activity, count });
                        }
                    });
                    return acc;
                }, []).map(({ key, count }) => (
                    getCombinedActivityDisplay(key, count)
                ))}
            </ul>
        </div>
        <h2 className="font-bold text-4xl mt-4">Individual:</h2>
        {Object.entries(results).map(([username, activities]) => (
            <div className="p-4 my-4 ring-2 rounded ring-gq-blue odd:ring-jl-red_hover" key={username}>
                <h2 className="text-3xl font-bold underline">{username.charAt(0).toUpperCase() + username.slice(1)}:</h2>
                <ul className="">
                    {Object.entries(activities).map(([activity, count]) => (
                        getActivityDisplay(activity, count)
                    ))}
                </ul>
            </div>
        ))}
    </div>
  )
}

export default Results