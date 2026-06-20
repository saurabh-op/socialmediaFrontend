import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WebSocketProvider } from "./services/webSocketContext.jsx";
import "./App.css";
import Login from "./screens/LoginSignup/Login";
import SignUp from "./screens/LoginSignup/SignUp";
import Feed from "./screens/Feed/Feed";
import SearchPage from "./screens/SearchFriends/SearchFriends";
import ChatPage from "./screens/Messages/chatPage";
import UserInfoPage from "./screens/ProfilePage/UserInfoPage";
import ViewUserPage from "./screens/ProfilePage/viewUser.jsx";
import Notification from "./screens/Notifications/notification.jsx";
import EditProfile from "./screens/edit profile/edit_profile.jsx";
import BackgroundBlobs from "./BackgroundBlobs.jsx";

function App() {
  return (
    <WebSocketProvider>
      <BackgroundBlobs />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/feed" element={<Feed />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile/:userId" element={<UserInfoPage />} />
          <Route path="/viewuser/:userId" element={<ViewUserPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
