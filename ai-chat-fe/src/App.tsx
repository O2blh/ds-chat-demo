import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./modules/Home";
import Chat from "./modules/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/chat/:chatId" Component={Chat} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
