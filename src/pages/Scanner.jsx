import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../config/firebase/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("Initializing Camera...");
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanFailure);

    async function onScanSuccess(decodedText) {
      scanner.clear(); // Stop scanning once we find a code
      setScanResult(decodedText);
      setStatus("Verifying Ticket...");
      validateTicket(decodedText);
    }

    function onScanFailure(err) {
      // Logic for continuous scanning attempts
    }

    return () => scanner.clear();
  }, []);

  const validateTicket = async (ticketId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      let found = false;

      for (const eventDoc of querySnapshot.docs) {
        const eventData = eventDoc.data();
        const attendees = eventData.attendees || [];
        
        const attendeeIndex = attendees.findIndex(a => a.ticketId === ticketId);

        if (attendeeIndex !== -1) {
          found = true;
          const attendee = attendees[attendeeIndex];

          if (attendee.validated) {
            setStatus("❌ ALREADY USED");
            return;
          }

          // Update the specific attendee in the array
          const updatedAttendees = [...attendees];
          updatedAttendees[attendeeIndex].validated = true;

          await updateDoc(doc(db, "events", eventDoc.id), {
            attendees: updatedAttendees
          });

          setStatus("✅ CHECK-IN SUCCESSFUL");
          break;
        }
      }

      if (!found) setStatus("⚠️ TICKET NOT FOUND");
    } catch (error) {
      console.error(error);
      setStatus("Error processing ticket.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[3rem] p-8 text-center shadow-2xl">
        <h1 className="text-xl font-black text-white uppercase tracking-widest mb-6">Security Check</h1>
        
        <div id="reader" className="overflow-hidden rounded-2xl border border-white/5 mb-6"></div>

        <div className={`py-4 rounded-xl font-black uppercase text-xs tracking-widest ${
          status.includes("SUCCESS") ? "bg-green-500/20 text-green-500" : 
          status.includes("ALREADY") || status.includes("NOT FOUND") ? "bg-red-500/20 text-red-500" : 
          "bg-white/5 text-slate-400"
        }`}>
          {status}
        </div>

        {scanResult && (
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            Scan Next →
          </button>
        )}

        <button 
          onClick={() => navigate("/organizer")}
          className="mt-4 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Scanner;