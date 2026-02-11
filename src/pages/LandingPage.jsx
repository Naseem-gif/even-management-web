import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase/firebaseconfig";
import EventCards from "../components/EventCards";

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("isActive", "==", true));

    // Real-time listener for "live" ticket counts and new events
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setFetching(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
     
      <div className="relative overflow-hidden bg-slate-900 pt-24 pb-32 lg:pt-32 lg:pb-48">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Future of Events.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The world's premier platform for high-impact tech gatherings. 
            Secure your spot at exclusive conferences, workshops, and meetups.
          </p>
          
          {!authLoading && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300"
                  >
                    Get Started — It's Free
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-10 py-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(user.role === "organizer" ? "/organizer" : "/home")}
                  className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Enter Dashboard
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="py-6 text-center border-r border-slate-50">
            <p className="text-3xl font-black text-slate-900">50k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Users</p>
          </div>
          <div className="py-6 text-center border-r border-slate-50">
            <p className="text-3xl font-black text-slate-900">120+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Events</p>
          </div>
          <div className="py-6 text-center">
            <p className="text-3xl font-black text-slate-900">99.9%</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Satisfaction</p>
          </div>
        </div>
      </div>

      {/* --- EVENTS SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Upcoming Experiences
            </h2>
            <p className="text-slate-500 mt-3 text-lg">Spotlight events selected by our editors.</p>
          </div>
          <div className="h-[2px] w-24 bg-indigo-600 hidden md:block"></div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🎈
            </div>
            <p className="text-slate-400 text-xl font-medium">The stage is being set. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <EventCards key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      
      <footer className="bg-white border-t border-slate-100 py-12 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 Eventify Inc. Built for the modern organizer.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;