import React, { useEffect, useState } from "react";
import { db } from "../config/firebase/firebaseconfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import EventCards from "../components/EventCards";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Real-time listener: Only active events
    const q = query(collection(db, "events"), where("isActive", "==", true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 selection:bg-indigo-500/30">
      {/* 🧩 Grainy Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* ⚡ Structural Header Section */}
      <div className="pt-24 pb-16 px-6 relative z-10 border-b border-white/5 bg-[#111]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
                Live Experiences
              </span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                Welcome back, <br />
                <span className="text-slate-500 italic">{user?.name?.split(' ')[0] || "Explorer"}.</span>
              </h1>
            </div>
            
          
          </div>
        </div>
      </div>

      {/* 📦 Bento Grid Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16 relative z-10">
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Available Broadasts</h2>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase">{events.length} Events Total</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              /* Pass the new dark style props if EventCards handles them, 
                 otherwise, the container here handles the spacing */
              <div key={event.id} className="transform transition-all hover:-translate-y-1">
                <EventCards event={event} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-[#111] rounded-[3rem] border border-dashed border-white/10">
              <p className="text-slate-600 text-xs font-black uppercase tracking-widest">
                The feed is currently silent.
              </p>
              <p className="text-slate-800 mt-2 text-sm">Check back soon for new drops.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;