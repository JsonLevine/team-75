import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import './index.css';
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker/:user" element={<Tracker />} />
      </Routes>
    </Router>
  );
}
