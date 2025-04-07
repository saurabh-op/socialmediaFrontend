import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./screens/UserRegistration";
import HomePage from "./screens/HomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
