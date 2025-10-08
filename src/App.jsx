import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./index.css";
import Home from "./pages/Home.jsx";
import Tracker from "./pages/Tracker.jsx";
import Header from "./pages/Header.jsx";
import Calendar from "./pages/Calendar.jsx";
import supabase from "./lib/supabase";
import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState();
  const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

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
        <Route path="/tracker/:username" element={<Tracker data={data} setData={setData} />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}
