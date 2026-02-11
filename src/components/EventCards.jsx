import React from "react";
import { useNavigate } from "react-router-dom";

const EventCards = ({ event }) => {
  const navigate = useNavigate();

 
  const booked = event.bookedTickets || 0;
  const total = event.totalTickets || 0;
  const isSoldOut = booked >= total;
  const progress = (booked / (total || 1)) * 100;

  const handleClick = () => {
   
    navigate(`/event/${event.id}`, { state: { event } });
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-[#111] border border-white/10 rounded-[2rem] p-7 cursor-pointer transition-all hover:border-indigo-500/50 hover:bg-[#161616] flex flex-col h-full overflow-hidden"
    >
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-all"></div>

      <div className="relative z-10 flex flex-col h-full">
       
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              Event Pass
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
              {event.title}
            </h2>
          </div>
          {isSoldOut && (
            <span className="bg-red-500/10 text-red-500 text-[9px] font-black px-3 py-1 rounded-full border border-red-500/20 uppercase">
              Sold Out
            </span>
          )}
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-tighter">
              {event.date}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Availability</p>
              <p className="text-xs font-mono text-slate-300">
                {booked} <span className="text-slate-600">/</span> {total}
              </p>
            </div>
            
           
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isSoldOut ? 'bg-red-500/50' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div 
          className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all ${
            isSoldOut 
              ? "bg-white/5 text-slate-600 cursor-not-allowed" 
              : "bg-white text-black hover:bg-indigo-500 hover:text-white shadow-xl shadow-white/5"
          }`}
        >
          {isSoldOut ? "Manifest Full" : "Secure Access →"}
        </div>
      </div>
    </div>
  );
};

export default EventCards;