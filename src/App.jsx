import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "./config/firebase/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { setUser, clearUser } from "./config/redux/reducers/authSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import MyTickets from "./pages/MyTickets";
import EventDetails from "./pages/EventDetails";
import Organizer from "./pages/Organizer";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          
          if (snap.exists()) {
            dispatch(
              setUser({
                uid: currentUser.uid,
                email: currentUser.email,
                ...snap.data(),
              })
            );
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "organizer" ? "/organizer" : "/home"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

      
        <Route
          path="/home"
          element={
            <ProtectedRoutes role='attendee'>
              <Home />
            </ProtectedRoutes>
          }
        />

      
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoutes role="attendee">
              <MyTickets />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoutes role="attendee">
              <EventDetails />
            </ProtectedRoutes>
          }
        />

       
        <Route
          path="/organizer"
          element={
            <ProtectedRoutes role="organizer">
              <Organizer />
            </ProtectedRoutes>
          }
        />

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;