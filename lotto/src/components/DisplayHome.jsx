import React, { useState, useEffect } from "react";
import { Wallet, User, Star } from "lucide-react";

const getToken = () => {
  return localStorage.getItem("token"); // Ensure this actually stores the token after login
};

const DisplayHome = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setAccountData(res.data);
        } else {
          throw new Error(res.message || "Failed to fetch account data");
        }
      } catch (err) {
        setError(err.message);
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
      window.location.href = "/balance";
    } else if (title === "Account") {
      window.location.href = "/account";
    } else if (title === "Bet 6/49") {
      window.location.href = "/bet";
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
