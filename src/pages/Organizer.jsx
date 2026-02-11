import React, { useEffect, useState } from "react";
import { db } from "../config/firebase/firebaseconfig";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddEvent from "../components/AddEvent";

const Organizer = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "organizer") navigate("/");

    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleValidateTicket = async (eventId, ticketId) => {
    try {
      const eventRef = doc(db, "events", eventId);
      const event = events.find((e) => e.id === eventId);
      const updatedAttendees = event.attendees.map((t) =>
        t.ticketId === ticketId ? { ...t, validated: true } : t
      );
      await updateDoc(eventRef, { attendees: updatedAttendees });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Permanent Delete? This cannot be undone.")) {
      await deleteDoc(doc(db, "events", eventId));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 selection:bg-indigo-500/30">
      
    
      <div className="bg-[#111] border-b border-white/5 pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              Admin Console
            </span>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Panel</h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => navigate("/scanner")}
              className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-indigo-600/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="12"></line><line x1="8" y1="12" x2="12" y2="12"></line><line x1="12" y1="12" x2="16" y2="12"></line><line x1="12" y1="12" x2="12" y2="16"></line><line x1="7" y1="7" x2="7" y2="7"></line><line x1="17" y1="7" x2="17" y2="7"></line><line x1="17" y1="17" x2="17" y2="17"></line><line x1="7" y1="17" x2="7" y2="17"></line></svg>
              Launch Entry Scanner
            </button>

            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl min-w-[120px]">
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-tighter mb-1">Live Events</p>
              <p className="text-xl font-black">{events.length}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl min-w-[120px]">
              <p className="text-slate-500 text-[8px] font-black uppercase tracking-tighter mb-1">Tickets Sold</p>
              <p className="text-xl font-black text-indigo-500">
                {events.reduce((acc, curr) => acc + (curr.bookedTickets || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
         
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#111] border border-white/10 rounded-3xl p-2 shadow-2xl">
              <AddEvent />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Event Management</h2>
               <div className="h-px flex-1 bg-white/5 ml-4"></div>
            </div>

            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden transition-all hover:border-indigo-500/50"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{event.date}</span>
                       <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                       <span className="text-[10px] font-black text-indigo-500 uppercase">
                         {event.bookedTickets || 0} / {event.totalTickets} Confirmed
                       </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>

                <div className="p-8">
                  {!event.attendees || event.attendees.length === 0 ? (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                       <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No bookings yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {event.attendees.map((attendee) => (
                        <div
                          key={attendee.ticketId}
                          className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                            attendee.validated 
                            ? "bg-green-500/5 border-green-500/20" 
                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                          }`}
                        >
                          <div>
                            <p className={`font-bold text-sm ${attendee.validated ? "text-green-400" : "text-slate-200"}`}>
                              {attendee.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-500 uppercase">
                              {attendee.ticketId.substring(0, 8)}
                            </p>
                          </div>

                          {attendee.validated ? (
                            <div className="flex flex-col items-end">
                              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Checked In</span>
                              <span className="text-lg">✓</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleValidateTicket(event.id, attendee.ticketId)}
                              className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                            >
                              Check In
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizer;