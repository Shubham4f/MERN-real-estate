import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchFromUrl = urlParams.get("searchTerm");
    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [window.location]);

  return (
    <nav className="bg-slate-200 shadow-md flex justify-between items-center px-5 py-1">
      <Link to="/" className="font-bold text-sm sm:text-xl text-slate-700">
        Estate
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 p-3 rounded-lg flex justify-between items-center"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent focus:outline-none w-20 sm:w-64"
        />
        <button>
          <FaSearch className="text-slate-500 cursor-pointer" />
        </button>
      </form>
      <ul className="flex gap-4 items-center">
        <li className="text-slate-700 hidden sm:inline hover:underline">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? "font-bold text-slate-800" : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li className="text-slate-700 hidden sm:inline hover:underline">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${isActive ? "font-bold text-slate-800" : ""}`
            }
          >
            About
          </NavLink>
        </li>
        <li className="text-slate-700 hover:underline">
          {currentUser ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${isActive ? "block border-2 border-black rounded-full" : ""}`
              }
            >
              <img
                className="rounded-full h-9 w-9 object-cover"
                src={currentUser.avatar}
                alt="Profile"
              />
            </NavLink>
          ) : (
            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                `${isActive ? "font-bold text-slate-800" : ""}`
              }
            >
              Sign In
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Header;
