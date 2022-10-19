import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Startpage } from "./components/Startpage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="" element={<Startpage/>}/>
          <Route path=":room/:name" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
