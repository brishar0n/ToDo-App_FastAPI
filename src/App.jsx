import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todo from "./pages/Todo";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing/>} />
        <Route path="/todo" element={<Todo/>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>

    // <Todo/>
    
  );
}

export default App;
