import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./index.css";
import Home from "./pages/Home.jsx";
import Tracker from "./pages/Tracker.jsx";
import Header from "./pages/Header.jsx";
import Footer from "./pages/Footer.jsx";
import Calendar from "./pages/Calendar.jsx";
import Debug from "./pages/Debug.jsx";
import supabase from "./lib/supabase";
import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState();
  const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  const [todaysMessages, setTodaysMessages] = useState();

    // Fetch today's progress for both users
    useEffect(() => {
      const fetchProgress = async () => {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .in("username", ['jason', 'gabby'])
          .eq("date", today);
        if (error) {
          console.error(error);
          return;
        }

        const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")	
        .in("recipient", ['jason', 'gabby'])
        .eq("date", today);
        if (messageError) {
          console.error(messageError);
        } 
        const messageToJason = messageData.find((row) => row.recipient === 'jason') || {};
        const messageToGabby = messageData.find((row) => row.recipient === 'gabby') || {};
        setTodaysMessages({ jason: messageToJason.message || '', gabby: messageToGabby.message || '' });

        const jason = data.find((row) => row.username === 'jason') || {};
        const gabby = data.find((row) => row.username === 'gabby') || {};
        setData({ jason, gabby });
      };
      fetchProgress();
    }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker/:username" element={<Tracker data={data} setData={setData} todaysMessages={todaysMessages} />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/debug" element={<Debug />} />
      </Routes>
      <Footer />
    </Router>
  );
}
