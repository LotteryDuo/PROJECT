import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
// import App from "./App.jsx";
import Check from "./pages/Check.jsx";
import SignIn from "./pages/SignIn.jsx";
import Home from "./pages/Home.jsx";
import Bet from "./pages/Bet.jsx";
import Balance from "./pages/Balance.jsx";
import Account from "./pages/Account.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Check />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bet" element={<Bet />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/Account" element={<Account />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  </StrictMode>
);
