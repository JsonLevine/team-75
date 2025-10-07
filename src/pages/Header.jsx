import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-linear-to-r from-gq-violet from-50% to-jl-red text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-3xl">
        Team 75
      </Link>
      <nav className="space-x-4">
        <Link
          to="/calendar"
          className="text-gq_orange font-bold hover:text-gq_orange_hover hover:underline"
        >
          Calendar
        </Link>
      </nav>
    </header>
  );
}

export default Header;
