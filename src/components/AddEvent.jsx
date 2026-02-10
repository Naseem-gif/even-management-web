import React, { useState } from "react";
import { db } from "../config/firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        totalTickets: Number(totalTickets),
        bookedTickets: 0,
        isActive: true,
        attendees: [],
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setDescription("");
      setDate("");
      setTotalTickets("");
      alert("Event Published! 🚀");
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h3 className="text-xl font-black text-white tracking-tight">Launch Event</h3>
        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">
          Fill in the technical specs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Event Title</label>
          <input
            type="text"
            placeholder="e.g., Next.js Conf 2026"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Description</label>
          <textarea
            placeholder="What's the vibe? Max 200 chars."
            rows="3"
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Capacity</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
              value={totalTickets}
              onChange={(e) => setTotalTickets(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          {loading ? "Deploying..." : "Push to Live →"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;