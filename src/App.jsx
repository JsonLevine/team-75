import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import "./index.css";
import Home from "./pages/Home.jsx";
import Tracker from "./pages/Tracker.jsx";
import Header from "./pages/Header.jsx";
import Calendar from "./pages/Calendar.jsx";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker/:username" element={<Tracker />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}
