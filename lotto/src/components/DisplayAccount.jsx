import React, { useState, useEffect } from "react";
import { ArrowLeft, Wallet, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const getToken = () => sessionStorage.getItem("token");
const getUsername = () => sessionStorage.getItem("username") || "Guest";

const DisplayAccount = () => {
  const [balance, setBalance] = useState(1000); // Mock balance
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updateBalance", (newBalance) => {
      setBalance(newBalance);
    });

    return () => {
      socket.off("updateBalance");
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Remove user session
    navigate("/sign-in"); // Redirect to login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* User Info */}
      <div className="bg-gray-800 p-6 mt-4 rounded-xl shadow-lg w-full max-w-md text-center">
        <User className="w-12 h-12 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-2">{getUsername()}</h2>
        <p className="text-gray-400">Account Information</p>
      </div>

      {/* Balance Info */}
      <div className="bg-gray-800 p-6 mt-4 rounded-xl shadow-lg w-full max-w-md text-center">
        <Wallet className="w-12 h-12 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold mt-2">₱{balance}</h2>
        <p className="text-gray-400">Current Balance</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutPopup(true)}
        className="mt-6 flex items-center gap-2 bg-red-600 px-6 py-3 text-white rounded-lg shadow-md hover:bg-red-700 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to exit?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayAccount;
