import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../config/firebase/firebaseconfig";
import { signOut } from "firebase/auth";
import { clearUser } from "../config/redux/reducers/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Logic to define link styles based on current path
  const linkStyle = (path) => 
    `text-sm font-black uppercase tracking-widest transition-all ${
      location.pathname === path 
      ? "text-indigo-400" 
      : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
          to={user ? (user.role === "organizer" ? "/organizer" : "/home") : "/"} 
          className="group flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic">
            EVENTIFY
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {user ? (
            <>
              {/* Attendee Specific Links */}
              {user.role === "attendee" && (
                <>
                  <Link to="/home" className={linkStyle("/home")}>Browse</Link>
                  <Link to="/my-tickets" className={linkStyle("/my-tickets")}>My Tickets</Link>
                </>
              )}

              {/* Organizer Specific Links */}
              {user.role === "organizer" && (
                <>
                  <Link to="/organizer" className={linkStyle("/organizer")}>Dashboard</Link>
                </>
              )}

              {/* User Profile & Logout */}
              <div className="flex items-center gap-6 ml-4 pl-8 border-l border-white/10">
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter leading-none">
                    {user.role}
                  </p>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                >
                  LOGOUT
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              {location.pathname !== "/login" && (
                <Link to="/login" className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                  Login
                </Link>
              )}
              {location.pathname !== "/signup" && (
                <Link 
                  to="/signup" 
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                >
                  Join Now
                </Link>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU ICON (Visual Placeholder) */}
        <div className="md:hidden text-white text-2xl">
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;