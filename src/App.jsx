import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./screens/LoginSignup/Login";
import SignUp from "./screens/LoginSignup/SignUp";
import Feed from "./screens/Feed/Feed";
import SearchPage from "./screens/SearchFriends/SearchFriends";
import UserInfoPage from "./screens/ProfilePage/UserInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<SearchPage />} />
        <Route path="/notification" element={<SearchPage />} />{" "}
        <Route path="/profile/:userId" element={<UserInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
