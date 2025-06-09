import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="w-full mb-12 bg-[#12121e] text-white shadow-md">
      <nav className="flex items-center justify-between py-4 px-4 sm:px-6 md:px-10">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="animate-flicker text-orange-500 drop-shadow-[0_0_8px_#f97316] text-4xl">
            ⚡
          </span>
          <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text text-transparent animate-pulse">
            AI-Browser-Agent
          </span>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-4 items-center">
          <Link
            to="/login"
            className="text-sm hover:text-orange-400 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-orange-500 px-4 py-2 rounded font-medium text-sm hover:bg-orange-600 transition duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-white focus:outline-none text-2xl"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 px-4 pb-4 animate-slide-down">
          <Link
            to="/login"
            className="text-sm hover:text-orange-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-orange-500 px-4 py-2 rounded font-medium text-sm hover:bg-orange-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
