import React, { useState } from "react";
import { auth, db } from "../config/firebase/firebaseconfig";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Store Info in Firestore (Default: Attendee)
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "attendee",
        createdAt: new Date().toISOString(),
      });

      // 🛠️ The Fix: Sign out immediately so Firebase doesn't auto-login
      await signOut(auth);

      // 3. Success Feedback and Redirect
      alert("Account initialized successfully. Please authorize entry via the login gate.");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message || "Failed to initialize identity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 relative overflow-hidden mt-20">
      {/* 🧩 Grainy Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[440px] relative z-10 py-10">
        <div className="text-center mb-10">
          <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
           
          </span>
          <h1 className="text-4xl font-black tracking-tighter">
            Sign <span className="text-slate-500 italic">Up</span>
          </h1>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Legal Name</label>
              <input
                type="text"
                placeholder="Naseem Shah"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Identifier</label>
              <input
                type="email"
                placeholder="name@domain.com"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Secure Passkey</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              {loading ? "Registering..." : "Create Account →"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs font-bold">
              Already registered?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-white transition-colors uppercase tracking-widest ml-1">
                Authorize Here
              </Link>
            </p>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 opacity-30">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Security Gate Active</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;