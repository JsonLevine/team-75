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

export default function Tracker({ data, setData, message, setMessage }) {
  const { username } = useParams();
	const [isDayCompleted, setIsDayCompleted] = useState(false);
	const [progress, setProgress] = useState(
	data && (username === "jason" ? data.jason : data.gabby) ? (username === "jason" ? data.jason : data.gabby) : {}
	);
	const [otherProgress, setOtherProgress] = useState(
	data && (username === "jason" ? data.gabby : data.jason) ? (username === "jason" ? data.gabby : data.jason) : {}
	);
	const [messageToSend, setMessageToSend] = useState("");
	const [messageReceived, setMessageReceived] = useState("");
	const [showMessageModal, setShowMessageModal] = useState(false);

	const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  const legibleDate = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
	const startDate = new Date(2025, 9, 2); // Month is 0-indexed: 9 = October
	const totalDays = 75;

	// Generate array of 75 sequential dates
	const days = Array.from({ length: totalDays }, (_, i) => {
		const date = new Date(startDate);
		date.setDate(date.getDate() + i);
		return date
			.toLocaleString("en-US", { timeZone: "America/New_York" })
			.split(",")[0]; // YYYY-MM-DD
	});

  const otherUser = username === "jason" ? "gabby" : "jason";
  const userColor = username === "jason" ? "jl-red" : "gq-violet";
  const userLightColor =
    username === "jason" ? "jl-red" : "gq-violet_hover";
  const userSuccessColor = username === "jason" ? "jl-red_hover" : "gq-purple";
  const userFailColor = username === "jason" ? "jl-red" : "gq-violet";
  const otherUserFailColor =
    username === "jason" ? "gq-blue" : "jl-red_hover";
  const otherUserLightColor =
    username === "jason" ? "gq-violet_hover" : "jl-red";
  const userGradient =
    username === "jason"
      ? "bg-linear-to-r from-jl-red from-40% to-gq-violet"
      : "bg-linear-to-r from-gq-violet from-40% to-jl-red";

  const userTextColor = username === "jason" ? "text-jl-red" : "text-gq-purple";
  const otherUserTextColor =
    username === "jason" ? "text-gq-purple" : "text-jl-red";

  // Fetch today's progress for both users
  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .in("username", [username, otherUser])
        .eq("date", today);
			const { data: messageData, error: messageError } = await supabase
				.from("messages")
				.select("*")	
				.eq("recipient", username)
				.eq("date", today);
			if (messageError) {
				console.error(messageError);
			} else if (messageData && messageData.length > 0) {
				setMessageReceived(messageData[0].message);
			} else {
				setMessageReceived("");
			}

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

			const allDone = activities.every(act => 
				(data.find(row => row.username === username) || {})[act.key] ||
				(data.find(row => row.username === otherUser) || {})[act.key]
			);
				
			setIsDayCompleted(allDone);

      const current = data.find((row) => row.username === username) || {};
      const other = data.find((row) => row.username === otherUser) || {};
			const newData = username === "jason" ? { jason: current, gabby: other } : { jason: other, gabby: current };
			setData(newData);
      setProgress(current);
      setOtherProgress(other);
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
		setData(username === "jason" ? { jason: updated, gabby: otherProgress } : { jason: otherProgress, gabby: updated });
    setProgress(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["username", "date"] });

    if (error) {
      console.error("Error saving progress:", error);
    }
  };

	const handleMessageSend = async () => {
			if (messageToSend.trim() === "") return;
			const { error } = await supabase
				.from("messages")
				.upsert([{ sender: username, recipient: otherUser, message: messageToSend, date: today }], 
					{ onConflict: ["sender", "date"] });
			if (error) {
				console.error("Error sending message:", error);
			} else {
				setMessageToSend("");
				alert("Message sent!");
			}
		}

  return (
    <div className="p-4 max-w-md mx-auto">
      <div
        className={`${`${userTextColor}`} flex flex-row justify-around text-center border border-white rounded-3xl p-5 text-2xl font-bold mb-4`}
      >
				<div>
					{capitalizeFirstLetter(username)}'s tracker for
					<br /> <strong className={otherUserTextColor}>{legibleDate}</strong>
				</div>
				<span className="border-r border-white"></span>
				<span className="text-xl font-medium">Day <br/> 
					<strong className={`${`${otherUserTextColor}`}  text-3xl`}>{days.indexOf(today.split(",")[0]) + 1}</strong>
				</span>
      </div>

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
			<div>
				{messageReceived && (
					<div className={`flex flex-col bg-gray-800 border border-${otherUserLightColor} rounded p-3 mb-4`}>
						<div>
							<span className={`font-semibold ${otherUserTextColor}`}>{capitalizeFirstLetter(otherUser)} says: </span>
							<span className={`mt-2 `}>{messageReceived}</span>
						</div>
						<button onClick={() => setMessageReceived("")} className="block text-center rounded border p-2 mt-2 bg-gray-500">Dismiss</button>
					</div>
				)}
			</div>

			{!showMessageModal && <button
				onClick={() => setShowMessageModal(!showMessageModal)}
				className={`w-full bg-${userColor} text-white py-2 rounded hover:bg-${userLightColor} cursor-pointer font-semibold mb-2`}
			>{showMessageModal ? "Close Message Box" : `Leave a message for ${capitalizeFirstLetter(otherUser)}`}</button>}

			{showMessageModal && <div className={`bg-${userSuccessColor} p-4 rounded mb-6`}>
				<input
					type="text"
					value={messageToSend}
					onChange={e => setMessageToSend(e.target.value)}
					placeholder={`Leave a message for ${capitalizeFirstLetter(otherUser)}...`}
					className="w-full p-2 border-2 border-white rounded mt-2 bg-gray-800 text-white focus:outline-none focus:border-blue-500"
				/>
				<button
					onClick={() => handleMessageSend()}
					className={`mt-2 w-full bg-${userColor} text-white py-2 rounded hover:bg-${userLightColor} cursor-pointer font-semibold`}	
				>Send</button>
						
				<button
				onClick={() => setShowMessageModal(!showMessageModal)}
				className={`w-full bg-${userColor} text-white py-2 mt-2 rounded hover:bg-${userLightColor} cursor-pointer font-semibold mb-2`}
			>Close Message Box</button>

			</div>}

      <h2 className="text-xl font-semibold my-2">
        {isDayCompleted ? <span className="text-green-400">Day complete! Go team!</span> : "Team progress"}
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
