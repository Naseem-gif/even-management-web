import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../config/firebase/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [status, setStatus] = useState("Initializing...");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const memoizedId = "reader"; // Keep ID consistent

  useEffect(() => {
    // Only start if the element exists and we haven't started yet
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(memoizedId);
    }

    const startCamera = async () => {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          onScanSuccess
        );
        setStatus("Ready to Scan");
      } catch (err) {
        console.error("Scanner start error:", err);
        setStatus("Camera Access Denied");
      }
    };

    // Small delay to ensure React has painted the 'reader' div
    const timer = setTimeout(startCamera, 500);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .then(() => { scannerRef.current.clear(); })
          .catch(e => console.log("Cleanup error", e));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    setStatus("Validating...");
    await validateTicket(decodedText);
  };

  const validateTicket = async (ticketId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      let found = false;

      for (const eventDoc of querySnapshot.docs) {
        const eventData = eventDoc.data();
        const attendees = eventData.attendees || [];
        const index = attendees.findIndex((a) => a.ticketId === ticketId);

        if (index !== -1) {
          found = true;
          if (attendees[index].validated) {
            setStatus("❌ ALREADY USED");
          } else {
            const updated = [...attendees];
            updated[index].validated = true;
            await updateDoc(doc(db, "events", eventDoc.id), { attendees: updated });
            setStatus("✅ SUCCESSFUL");
          }
          break;
        }
      }
      if (!found) setStatus("⚠️ INVALID TICKET");
    } catch (e) {
      setStatus("Error connecting to DB");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        if (status.includes("SUCCESSFUL") || status.includes("INVALID") || status.includes("USED")) {
           setStatus("Ready to Scan");
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-xs font-black tracking-[0.3em] uppercase text-indigo-500 mb-2">Gate Security</h2>
          <div className={`text-lg font-black italic uppercase transition-all ${
            status.includes("✅") ? "text-green-500" : status.includes("❌") ? "text-red-500" : "text-white"
          }`}>
            {status}
          </div>
        </div>

        <div 
          id={memoizedId} 
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-black aspect-square mb-8 shadow-inner"
        >
          {isProcessing && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-ping w-12 h-12 rounded-full bg-indigo-500 opacity-75"></div>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate("/organizer")}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Scanner;