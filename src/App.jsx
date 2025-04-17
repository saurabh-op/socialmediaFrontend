import { BrowserRouter, Routes, Route } from "react-router-dom";

// import HomePage from "./screens/HomePage";
// import ChatPage from "./screens/chatPage";
//mport UserInfoPageWrapper from "./components/UserInfoPageWrapper";
import "./App.css";
import Login from "./screens/LoginSignup/Login";
import SignUp from "./screens/LoginSignup/SignUp";
import Home from "./screens/HomeScreen/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Login />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="/chats" element={<ChatPage />}></Route> */}
        <Route path="/signup" element={<SignUp />}></Route>
        {/* <Route path="/user/:id" element={<UserInfoPageWrapper />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
