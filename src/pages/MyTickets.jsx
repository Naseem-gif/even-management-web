import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../config/firebase/firebaseconfig";
import TicketQR from "../components/TicketQR";

const MyTickets = () => {
  const user = useSelector((state) => state.auth.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

   
    const q = query(collection(db, "events"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
     
      const userTickets = allEvents
        .filter(event => event.attendees?.some(a => a.uid === user.uid))
        .map(event => {
         
          const myEntry = event.attendees.find(a => a.uid === user.uid);
          return {
            ...event,
            ticketId: myEntry?.ticketId,
            bookedAt: myEntry?.bookedAt || event.createdAt 
          };
        });

      setTickets(userTickets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 mt-20">
      {/* Header Section */}
      <div className="bg-[#111] border-b border-white/5 pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Digital Vault
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            Your Access <span className="text-slate-500 italic">Passes.</span>
          </h1>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {tickets.length === 0 ? (
          <div className="text-center py-32 bg-[#111] rounded-[3rem] border border-dashed border-white/10">
            <div className="text-6xl mb-6 opacity-20 text-white">🎫</div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">No Passes Found</h2>
            <button 
              onClick={() => window.location.href = '/home'}
              className="mt-8 px-8 py-3 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tickets.map((ticket) => (
              <div key={ticket.ticketId} className="group flex flex-col items-center">
                <div className="w-full transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
    
                  <TicketQR 
                    ticketId={ticket.ticketId} 
                    eventTitle={ticket.title} 
                    userName={user.name} 
                  />
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-2">
                   <div className="flex items-center gap-3">
                     <button 
                        onClick={() => window.print()}
                        className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-tighter transition-colors px-4 py-2 bg-white/5 border border-white/10 rounded-full"
                      >
                        Download PDF
                      </button>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                         REF: {ticket.ticketId}
                      </span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;