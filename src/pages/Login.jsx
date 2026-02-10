import React, { useState } from "react";
import { auth, db } from "../config/firebase/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../config/redux/reducers/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        dispatch(setUser({ uid: userCredential.user.uid, email, ...userData }));
        
        // Direct routing based on role
        navigate(userData.role === "organizer" ? "/organizer" : "/home");
      }
    } catch (error) {
      alert("Invalid Credentials. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter">
            Sign In
          </h1>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Passkey</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs font-bold">
              New to the platform?{" "}
              <Link to="/signup" className="text-indigo-400 hover:text-white transition-colors uppercase tracking-widest ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;