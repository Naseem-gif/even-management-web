import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../config/firebase/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [status, setStatus] = useState("Accessing Camera...");
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initialize instance immediately
    scannerRef.current = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        // 2. Request camera with specific constraints for faster lock-on
        await scannerRef.current.start(
          { facingMode: "environment" }, // Forces back camera immediately
          {
            fps: 20, // Higher FPS for snappier detection
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess
        );
        setStatus("Ready to Scan");
      } catch (err) {
        setStatus("Camera Error: Check Permissions");
        console.error(err);
      }
    };

    startScanner();

    // Cleanup: Stop camera immediately when leaving page
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  async function onScanSuccess(decodedText) {
    // Play a haptic feedback if supported
    if (navigator.vibrate) navigator.vibrate(100);
    
    setScanResult(decodedText);
    setStatus("Verifying...");
    
    // Stop scanner to save resources while processing
    await scannerRef.current.stop();
    validateTicket(decodedText);
  }

  const validateTicket = async (ticketId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      let found = false;

      for (const eventDoc of querySnapshot.docs) {
        const eventData = eventDoc.data();
        const attendees = eventData.attendees || [];
        const index = attendees.findIndex(a => a.ticketId === ticketId);

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
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[3rem] p-8 text-center shadow-2xl">
        <div className="mb-6">
          <h1 className="text-white font-black uppercase tracking-widest text-sm">Scanner Pro</h1>
          <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${
            status.includes("✅") ? "text-green-500" : status.includes("❌") ? "text-red-500" : "text-indigo-400"
          }`}>{status}</p>
        </div>
        
        {/* The Video Feed Container */}
        <div id="reader" className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/20 bg-black aspect-square">
            {/* Minimalist Scanner Overlay */}
            {!scanResult && <div className="absolute inset-0 border-2 border-indigo-500/50 animate-pulse pointer-events-none z-10 rounded-2xl"></div>}
        </div>

        {scanResult && (
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
          >
            Scan Next
          </button>
        )}
        
        <button onClick={() => navigate("/organizer")} className="mt-6 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
          Exit Scanner
        </button>
      </div>
    </div>
  );
};

export default Scanner;