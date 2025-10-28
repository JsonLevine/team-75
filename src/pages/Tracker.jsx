import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabase";

const activities = [
  { key: "workout", label: "45 minute workout" },
  { key: "water", label: "64 ounces of water" },
  { key: "meditation", label: "10 minutes of meditation" },
  { key: "reading", label: "10 pages of reading" },
];

const dayCompleteMessages = [ 
  "Day complete! Go team!",
  "One more day in the books!",
  "Nothing is impossible!",
];

function capitalizeFirstLetter(str) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Tracker({ data, setData, todaysMessages }) {
  const { username } = useParams();
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [progress, setProgress] = useState(
    data && (username === "jason" ? data.jason : data.gabby)
      ? username === "jason"
        ? data.jason
        : data.gabby
      : {}
  );
  const [otherProgress, setOtherProgress] = useState(
    data && (username === "jason" ? data.gabby : data.jason)
      ? username === "jason"
        ? data.gabby
        : data.jason
      : {}
  );
  const [messageToSend, setMessageToSend] = useState("");
  const [todaysWeight, setTodaysWeight] = useState("");
  const [todaysWeightSubmitted, setTodaysWeightSubmitted] = useState(false);
  const [messageReceived, setMessageReceived] = useState(
    todaysMessages &&
      (username === "jason" ? todaysMessages.jason : todaysMessages.gabby)
      ? username === "jason"
        ? todaysMessages.jason
        : todaysMessages.gabby
      : ""
  );
  const [showMessageModal, setShowMessageModal] = useState(false);

  const today = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const legibleDate = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const startDate = new Date(2025, 9, 18); // Month is 0-indexed: 9 = October
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

  /*
   * Primary user colors
   * - User completed activity tile
   * - "Leave a message" button, and modal closing buttons
   */
  const userColor = username === "jason" ? "jl-red" : "gq-violet";

  // Color for the "Dismiss message" button
  const dismissMessageColor = username === "jason" ? "gq-violet" : "jl-red";
  const dismissMessageHoverColor =
    username === "jason" ? "gq-violet_hover" : "jl-red_hover";

  /*
   * Light user colors
   * - "Leave a message" button, and modal closing buttons hover state
   */
  const messageButtonColor =
    username === "jason" ? "jl-red_hover" : "gq-violet_hover";

  // Colors for other user's completed activity tile
  const otherUserCompletedActivityColor =
    username === "jason" ? "gq-violet_hover" : "jl-red";

  // Colors for user's completed activity slider
  const userSuccessColor = username === "jason" ? "jl-red_hover" : "gq-purple";
  const userFailColor = username === "jason" ? "jl-red" : "gq-violet";
  // Colors for other user's completed activity slider
  const otherUserCompletedSliderColor =
    username === "jason" ? "gq-blue" : "jl-red_hover";

  // Inbound message box border color
  const messageBorderColor =
    username === "jason" ? "border-gq-purple" : "border-jl-red";
  const userBorderColor =
    username === "jason" ? "border-jl-red" : "border-gq-purple";
  // Outbound message box background color
  const messageModalColor = username === "jason" ? "gq-violet" : "jl-red";

  // Gradient for when both users have completed an activity
  const userGradient =
    username === "jason"
      ? "bg-linear-to-r from-jl-red from-40% to-gq-violet"
      : "bg-linear-to-r from-gq-violet from-40% to-jl-red";

  /* Text colors
   * - User's name at top of page
   * - "Your" in "Your progress for the day" header
   */
  const userTextColor = username === "jason" ? "text-jl-red" : "text-gq-purple";

  /* Other user text colors
   * - Date at top of page
   * - Other user's name in inbound message box
   */
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
      const current = data.find((row) => row.username === username) || {};
      const weight = current.weight || "";
      const other = data.find((row) => row.username === otherUser) || {};
      const newData =
        username === "jason"
          ? { jason: current, gabby: other }
          : { jason: other, gabby: current };
      if (weight !== "") {
        setTodaysWeight(weight);
        setTodaysWeightSubmitted(true);
      }
      setData(newData);
      setProgress(current);
      setOtherProgress(other);
    };
    fetchProgress();
  }, [username]);

  useEffect(() => {
    const allDone = activities.every(
      (act) => progress[act.key] || otherProgress[act.key]
    );
    setIsDayCompleted(allDone);
  }, [progress, otherProgress]);

  const handleToggle = async (key) => {
    const updated = {
      ...progress,
      username,
      date: today,
      [key]: !progress[key],
    };
    setData(
      username === "jason"
        ? { jason: updated, gabby: otherProgress }
        : { jason: otherProgress, gabby: updated }
    );
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
      .upsert(
        [
          {
            sender: username,
            recipient: otherUser,
            message: messageToSend,
            date: today,
          },
        ],
        { onConflict: ["sender", "date"] }
      );
    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessageToSend("");
      alert("Message sent!");
    }
  };

  const handleWeightSubmission = async () => {
    if (todaysWeight.trim() === "") return;
    const updated = {
      ...progress,
      username,
      date: today,
      weight: todaysWeight,
    };
    setData({ jason: updated, gabby: otherProgress });
    setProgress(updated);

    const { error } = await supabase
      .from("progress")
      .upsert(updated, { onConflict: ["username", "date"] });

    if (error) {
      console.error("Error saving weight:", error);
    } else {
      alert("Weight submitted!");
      setTodaysWeightSubmitted(true);
    }
  }

  const getRandomCompleteMessage = () => {
    const randomIndex = Math.floor(Math.random() * dayCompleteMessages.length);
    return dayCompleteMessages[randomIndex];
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
        <span className="text-xl font-medium">
          Day <br />
          <strong className={`${`${otherUserTextColor}`}  text-3xl`}>
            {days.indexOf(today.split(",")[0]) + 1}
          </strong>
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        <strong className={userTextColor}>Your</strong> progress for the day
      </h2>
      <div className="space-y-2 mb-6">
        {activities.map((act) => (
          <label
            key={act.key}
            className={`
						${
              otherProgress[act.key] && progress[act.key]
                ? `${userGradient} font-bold scale-105 line-through`
                : ""
            }
            ${progress[act.key] ? `bg-${userColor} scale-105 line-through` : ""}
            ${
              otherProgress[act.key] && !progress[act.key]
                ? `bg-${otherUserCompletedActivityColor} text-black line-through opacity-70`
                : ""
            }
            ${"transition-all duration-300 cursor-pointer flex items-center justify-between border border-white p-2 rounded"}
        `}
          >
            <span>{act.label}</span>
            <button
              type="button"
              onClick={() => handleToggle(act.key)}
              className={`w-12 h-6 flex items-center cursor-pointer rounded-full p-1 duration-300 focus:outline-none
								${
                  progress[act.key]
                    ? `bg-${userSuccessColor} justify-end`
                    : otherProgress[act.key]
                    ? `bg-${otherUserCompletedSliderColor} justify-start`
                    : `bg-${userFailColor} justify-start`
                }
                `}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform duration-300" />
            </button>
          </label>
        ))}

        { username === "jason" && 
        <>
          {!todaysWeightSubmitted ?
            <div>
              <input
                type="text"
                value={todaysWeight}
                onChange={(e) => setTodaysWeight(e.target.value)}
                placeholder={`Submit today's weight`}
                className={`w-full p-2 border-2 ${userBorderColor} rounded mt-2 bg-gray-800 text-white`}
              />
              <button
                onClick={() => handleWeightSubmission()}
                className={`mt-2 w-full bg-${userColor} text-white py-2 rounded hover:bg-${messageButtonColor} cursor-pointer font-semibold`}
              >
                Submit
              </button>
            </div> :
            
            <div>
              <span className="text-jl-red font-semibold">
                {username === "jason"
                  ? `Today's weight: ${progress.weight} lbs`
                  : ''} 
              </span>
            </div>
          }
        </>
        }

        {isDayCompleted && (
          <h2 className="text-3xl text-center flex font-semibold my-8">
            <span className="w-full text-green-700 bg-green-200 p-4 rounded">
              {getRandomCompleteMessage()}
            </span>
          </h2>
        )}
      </div>

      <div>
        {messageReceived && (
          <div
            className={`flex flex-col bg-gray-800 border-2 ${messageBorderColor} rounded p-3 mb-4`}
          >
            <div>
              <span className={`font-semibold ${otherUserTextColor}`}>
                {capitalizeFirstLetter(otherUser)}:{" "}
              </span>
              <span className={`mt-2 `}>{messageReceived}</span>
            </div>
            <button
              onClick={() => setMessageReceived("")}
              className={`block cursor-pointer text-center rounded border p-2 mt-8 bg-${dismissMessageColor} hover:bg-${dismissMessageHoverColor}`}
            >
              Dismiss message
            </button>
          </div>
        )}
      </div>

      {!showMessageModal && (
        <button
          onClick={() => setShowMessageModal(!showMessageModal)}
          className={`w-full bg-${userColor} text-white py-2 rounded hover:bg-${messageButtonColor} cursor-pointer font-semibold mb-2`}
        >
          {showMessageModal
            ? "Close Message Box"
            : `Leave a message for ${capitalizeFirstLetter(otherUser)}`}
        </button>
      )}

      {showMessageModal && (
        <div className={`bg-${messageModalColor} p-4 rounded mb-6`}>
          <input
            type="text"
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            placeholder={`Leave a message for ${capitalizeFirstLetter(
              otherUser
            )}...`}
            className={`w-full p-2 border-2 ${userBorderColor} rounded mt-2 bg-gray-800 text-white`}
          />
          <button
            onClick={() => handleMessageSend()}
            className={`mt-2 w-full bg-${userColor} text-white py-2 rounded hover:bg-${messageButtonColor} cursor-pointer font-semibold`}
          >
            Send
          </button>

          <button
            onClick={() => setShowMessageModal(!showMessageModal)}
            className={`w-full bg-${userColor} text-white py-2 mt-2 rounded hover:bg-${messageButtonColor} cursor-pointer font-semibold mb-2`}
          >
            Close Message Box
          </button>
        </div>
      )}
    </div>
  );
}
