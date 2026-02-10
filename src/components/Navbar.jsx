import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../config/firebase/firebaseconfig";
import { signOut } from "firebase/auth";
import { clearUser } from "../config/redux/reducers/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const linkStyle = (path) => 
    `text-sm font-black uppercase tracking-widest transition-all ${
      location.pathname === path 
      ? "text-indigo-400" 
      : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0a0a0a] border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
       
        <Link 
          onClick={() => setIsOpen(false)}
          to={user ? (user.role === "organizer" ? "/organizer" : "/home") : "/"} 
          className="group flex items-center gap-2 z-[110]"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic uppercase">
            EVENTIFY
          </span>
        </Link>

      
        <div className="hidden md:flex items-center gap-10">
          {user ? (
            <>
              {user.role === "attendee" && (
                <>
                  <Link to="/home" className={linkStyle("/home")}>Browse</Link>
                  <Link to="/my-tickets" className={linkStyle("/my-tickets")}>My Tickets</Link>
                </>
              )}

              {user.role === "organizer" && (
                <Link to="/organizer" className={linkStyle("/organizer")}>Dashboard</Link>
              )}

              <div className="flex items-center gap-6 ml-4 pl-8 border-l border-white/10">
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter leading-none">
                    {user.role}
                  </p>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all shadow-lg"
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
                <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                  Join Now
                </Link>
              )}
            </div>
          )}
        </div>

        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-[110] text-white text-3xl outline-none"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        
        <div className={`fixed inset-0 bg-[#0a0a0a] z-[105] flex flex-col items-center justify-center gap-12 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {user ? (
            <>
              {user.role === "attendee" && (
                <>
                  <Link onClick={() => setIsOpen(false)} to="/home" className="text-2xl font-black text-white uppercase tracking-[0.2em]">Browse</Link>
                  <Link onClick={() => setIsOpen(false)} to="/my-tickets" className="text-2xl font-black text-white uppercase tracking-[0.2em]">My Tickets</Link>
                </>
              )}

              {user.role === "organizer" && (
                <Link onClick={() => setIsOpen(false)} to="/organizer" className="text-2xl font-black text-white uppercase tracking-[0.2em]">Dashboard</Link>
              )}

              <button 
                onClick={handleLogout}
                className="mt-8 p-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-10">
              {location.pathname !== "/login" && (
                <Link onClick={() => setIsOpen(false)} to="/login" className="text-3xl font-black text-white uppercase">Login</Link>
              )}
              {location.pathname !== "/signup" && (
                <Link onClick={() => setIsOpen(false)} to="/signup" className="text-3xl font-black text-indigo-500 uppercase">Join Now</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;