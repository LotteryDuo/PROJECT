import React, { useState, useEffect } from "react";
import { ChevronLeft, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ButtonWithSound from "./ButtonWithSound";

import fetchAccountData from "../utils/fetchAccountData";

const socket = io("http://localhost:3000");

const getToken = () => sessionStorage.getItem("token");
const getUsername = () => sessionStorage.getItem("username") || "Guest";

const DisplayBalance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [accountData, setAccountData] = useState("");
  const [balance, setBalance] = useState(""); // Mock balance
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccountData = async () => {
      const data = await fetchAccountData();
      if (data) {
        setAccountData(data);
      } else {
        setError("Failed to load account data.");
      }
    };

    loadAccountData();
    setLoading(false);
  }, []);

  useEffect(() => {
    socket.on("updateBalance", (newBalance) => {
      setBalance(newBalance);
    });

    return () => {
      socket.off("updateBalance");
    };
  }, []);

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      alert("Enter a valid deposit amount!");
      return;
    }

    const newBalance = balance + depositAmount;
    setBalance(newBalance);
    socket.emit("updateBalance", newBalance);
    setAmount("");
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert("Enter a valid withdrawal amount!");
      return;
    }
    if (withdrawAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    const newBalance = balance - withdrawAmount;
    setBalance(newBalance);
    socket.emit("updateBalance", newBalance);
    setAmount("");
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <ButtonWithSound
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </ButtonWithSound>

      {/* Balance Info */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mt-4 text-center">
        <Wallet className="w-12 h-12 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-2">{getUsername()}</h2>
        <p className="text-gray-400">Current Balance</p>
        <h1 className="text-3xl font-bold mt-2">₱{accountData.balance}</h1>
      </div>

      {/* Deposit & Withdraw */}
      <div className="bg-gray-800 p-6 mt-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-center mb-4">
          Manage Balance
        </h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (₱)"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <div className="flex justify-between mt-4">
          <ButtonWithSound
            onClick={handleDeposit}
            className="w-[48%] py-2 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold"
          >
            Deposit
          </ButtonWithSound>
          <ButtonWithSound
            onClick={handleWithdraw}
            className="w-[48%] py-2 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
          >
            Withdraw
          </ButtonWithSound>
        </div>
      </div>
    </div>
  );
};

export default DisplayBalance;
