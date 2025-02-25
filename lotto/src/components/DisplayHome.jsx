import React, { useState, useEffect } from "react";
import { Wallet, User, Star, CodeSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const getToken = () => sessionStorage.getItem("token");

const getUsername = () => sessionStorage.getItem("username");

const DisplayHome = () => {
  const navigator = useNavigate();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const username = getUsername(); // Get the username from localStorage

    if (username) {
      socket.emit("userConnected", { username: username });
    } else {
      console.log("⚠️ No username found in localStorage!");
    }

    const handleUsersUpdate = (onlineUsers) => {
      setUsers(onlineUsers);
    };

    console.log(users);

    // Listen for the updateOnlineUsers event from the server
    socket.on("updateOnlineUsers", handleUsersUpdate);

    return () => {
      socket.off("updateOnlineUsers", handleUsersUpdate); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/account/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: "hello",
            token: getToken(),
          },
        });

        const res = await response.json();

        if (res.success) {
          return setAccountData(res.data);
        } else {
          throw new Error(res.message || "Failed to fetch account data");
        }
      } catch (err) {
        return setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const handleCardClick = (title) => {
    console.log(`Clicked on: ${title}`);

    // Example: Navigate to a page based on the card
    if (title === "Balance") {
      navigator("/balance");
    } else if (title === "Account") {
      navigator("/account");
    } else if (title === "Bet 6/49") {
      navigator("/bet");
    }
  };

  const cards = [
    {
      title: "Bet 6/49",
      value: accountData ? accountData.bet : "Loading...",
      icon: <Star className="text-yellow-500 w-8 h-8" />,
    },
    {
      title: "Balance",
      value: accountData ? `$${accountData.balance}` : "Loading...",
      icon: <Wallet className="text-green-500 w-8 h-8" />,
    },
    {
      title: "Account",
      value: accountData ? accountData.username : "Loading...",
      icon: <User className="text-blue-500 w-8 h-8" />,
    },
  ];

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-4 w-64 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Online Users
        </h2>
        <ul className="mt-2 text-sm text-gray-600">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li key={index} className="py-1">
                {user.username} is online
              </li>
            ))
          ) : (
            <li className="text-gray-400">No users online</li>
          )}
        </ul>
      </div>

      <h1 className="text-gray-800 text-4xl font-bold mb-10 border-b-2 border-blue-500 pb-5">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(card.title)}
            className="bg-sky-400 shadow-md rounded-lg p-6 flex items-center w-72 transition-transform transform hover:scale-105 active:scale-95"
          >
            <div className="p-3 bg-gray-200 rounded-full">{card.icon}</div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-gray-600">{card.value}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayHome;
