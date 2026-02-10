import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../config/firebase/firebaseconfig";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { useSelector } from "react-redux";

const EventDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  
  const event = state?.event;


  const userHasTicket = event?.attendees?.some((a) => a.uid === user?.uid);
  const isSoldOut = event?.bookedTickets >= event?.totalTickets;

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <button onClick={() => navigate("/home")} className="text-indigo-500 font-black uppercase tracking-widest">
          ← Back to Feed
        </button>
      </div>
    );
  }

  const handleBookTicket = async () => {
    
    if (user.role === "organizer") {
      alert("Organizers are restricted from booking tickets. Please use an attendee account.");
      return;
    }

    
    if (userHasTicket) {
      alert("System Conflict: You already hold a valid pass for this broadcast.");
      return;
    }

    setLoading(true);
    try {
      const ticketId = `TIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const eventRef = doc(db, "events", event.id);

     
      await updateDoc(eventRef, {
        bookedTickets: increment(1),
        attendees: arrayUnion({
          uid: user.uid,
          name: user.name,
          email: user.email,
          ticketId: ticketId,
          bookedAt: new Date().toISOString(),
          validated: false,
        }),
      });

      alert("Access Secured. Welcome to the event.");
      navigate("/my-tickets");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Transaction failed. System busy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white mt-20 pt-12 pb-20 px-6 relative">
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={() => navigate("/home")}
          className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
        >
          ← Return to Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          
          <div className="lg:col-span-7">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md">
              Broadcast Detail
            </span>
            <h1 className="text-6xl font-black tracking-tighter mt-6 mb-8 leading-none">
              {event.title}
            </h1>
            
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed max-w-xl">
              <p>{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Scheduled Date</p>
                <p className="font-mono text-xl">{event.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Access Tier</p>
                <p className="font-mono text-xl text-indigo-500">Universal Pass</p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-5">
            <div className="bg-[#111] border border-white/10 rounded-[3rem] p-10 sticky top-32 shadow-2xl">
              <div className="mb-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Availability Status</p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-black tracking-tighter">
                    {event.totalTickets - (event.bookedTickets || 0)}
                  </span>
                  <span className="text-slate-600 font-bold mb-2 uppercase text-xs tracking-widest">Spots Open</span>
                </div>
               
                <div className="h-1.5 w-full bg-white/5 mt-6 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isSoldOut ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${((event.bookedTickets || 0) / (event.totalTickets || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

             
              <button
                onClick={handleBookTicket}
                disabled={loading || userHasTicket || isSoldOut}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 ${
                  userHasTicket || isSoldOut
                    ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                    : "bg-white text-black hover:bg-indigo-600 hover:text-white shadow-xl shadow-white/5"
                }`}
              >
                {loading 
                  ? "Authenticating..." 
                  : userHasTicket 
                    ? "Pass Already Claimed" 
                    : isSoldOut 
                      ? "Manifest Full" 
                      : "Secure My Access →"}
              </button>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Digital Auth Only</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">No Physical Entry</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;