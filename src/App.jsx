import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './index.css';
import Home from "./pages/Home.jsx";
import Tracker from "./pages/Tracker.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker/:username" element={<Tracker />} />
      </Routes>
    </Router>
  );
}
