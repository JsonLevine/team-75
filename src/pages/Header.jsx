import React from "react";
import { Link } from "react-router-dom";
// import Debug from "./Debug";

function Header() {
  return (
    <header className="bg-linear-to-r from-gq-violet from-50% to-jl-red text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-3xl">
        Team 75
      </Link>
      {/* <Link to="/debug" className="text-white">
        Debug
      </Link> */}
      <nav className="space-x-4">
        <Link
          to="/calendar"
          className="text-2xl bg-gray-900 font-bold ring rounded p-2 hover:bg-gray-600"
        >
          Calendar
        </Link>
      </nav>
    </header>
  );
}

export default Header;
