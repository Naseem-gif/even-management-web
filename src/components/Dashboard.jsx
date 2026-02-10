import React, { useEffect, useState } from "react";
import { db } from "../config/firebase/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Global Overview</h1>

      {events.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500">No events found in the database.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                  <p className="text-gray-500 font-medium">📅 {event.date}</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
                  <p className="text-xs font-bold text-blue-400 uppercase">Booked</p>
                  {/* Matches your schema: bookedTickets and totalTickets */}
                  <p className="text-lg font-black text-blue-700">
                    {event.bookedTickets || 0} / {event.totalTickets}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">👥</span> Attendee List
                </h3>
                
                {/* Check for 'attendees' (the array we used in EventDetails) */}
                {event.attendees && event.attendees.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.attendees.map((attendee) => (
                      <li 
                        key={attendee.ticketId}
                        className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between"
                      >
                        <span className="font-medium text-gray-800">{attendee.name}</span>
                        <span className="text-gray-400 font-mono text-[10px] self-center">
                          #{attendee.ticketId.substring(0, 5)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">No bookings registered for this event yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;