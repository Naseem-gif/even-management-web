import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../config/firebase/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [status, setStatus] = useState("Accessing Camera...");
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 250, height: 250 } },
          onScanSuccess
        );
        setStatus("Ready to Scan");
      } catch (err) {
        setStatus("Camera Error: Check Permissions");
        console.error(err);
      }
    };

    startScanner();

    // Cleanup: Make sure camera is killed when leaving the page
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.log("Stop error:", e));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    if (isProcessing) return; // Prevent double scans
    setIsProcessing(true);
    
    if (navigator.vibrate) navigator.vibrate(100);
    setStatus("Verifying Ticket...");

    // 🛠️ IMPORTANT: Stop scanning but DON'T kill the component yet
    try {
      await scannerRef.current.pause(true); // Pause is safer than stop() mid-process
      await validateTicket(decodedText);
    } catch (err) {
      console.error(err);
    }
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
            setStatus("✅ CHECK-IN SUCCESSFUL");
          }
          break;
        }
      }
      if (!found) setStatus("⚠️ INVALID TICKET");
    } catch (e) {
      setStatus("Error.");
    } finally {
        // Keep the result on screen for 2 seconds so they can see it, then reset
        setTimeout(() => {
            setIsProcessing(false);
            if (scannerRef.current) scannerRef.current.resume();
            setStatus("Ready to Scan");
        }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[3rem] p-8 text-center shadow-2xl">
        <div className="mb-6">
          <h1 className="text-white font-black uppercase tracking-widest text-sm">Entry Scanner</h1>
          <div className={`mt-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
            status.includes("✅") ? "bg-green-500 text-black" : 
            status.includes("❌") || status.includes("INVALID") ? "bg-red-500 text-white" : 
            "bg-indigo-600/10 text-indigo-400"
          }`}>
            {status}
          </div>
        </div>
        
        <div id="reader" className="relative overflow-hidden rounded-2xl border-2 border-white/5 bg-black aspect-square mb-6">
            {/* Visual Scanner Guide */}
            {!isProcessing && (
                <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-black/50">
                    <div className="w-full h-full border-2 border-indigo-500 animate-pulse"></div>
                </div>
            )}
        </div>

        <button 
          onClick={() => navigate("/organizer")} 
          className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
        >
          Close Scanner
        </button>
      </div>
    </div>
  );
};

export default Scanner;