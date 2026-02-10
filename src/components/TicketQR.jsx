import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const TicketQR = ({ ticketId, eventTitle, userName }) => {
  return (
    <div className="relative max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Decorative Ticket "Cuts" */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-100 rounded-full shadow-inner"></div>
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-100 rounded-full shadow-inner"></div>

      <div className="p-6 flex flex-col items-center gap-4 text-center">

        {eventTitle && (
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            {eventTitle}
          </h2>
        )}
        
        {userName && (
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            {userName}
          </p>
        )}

        
        <div className="p-3 bg-white border-4 border-gray-50 rounded-xl shadow-inner">
          <QRCodeCanvas 
            value={ticketId} 
            size={180} 
            level={"H"} 
            includeMargin={false}
          />
        </div>

        
        <div className="w-full mt-2 pt-4 border-t border-dashed border-gray-200">
          <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">
            Scan for Entry
          </p>
          <p className="text-gray-900 font-mono text-xs mt-1">
            {ticketId.split('-')[0]}...{ticketId.slice(-5)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketQR;