import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserInfoPage.css";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import axios from "axios";

function UserInfoPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Munna Bhai ",
    username: "Circuit",
    bio: "Love coding and coffee ☕",
    posts: 120,
    followers: 3400,
    following: 180,
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/get/${userId}`
        );
        const data = await response.json();
        console.log("Fetched user is : ", data);
        if (data != null) {
          setUser((prevUser) => ({
            ...prevUser,
            name: data.name,
            username: data.username,
            bio: data.bio,
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/posts/allPosts/${userId}`
        );
        setPosts(res.data.gallery);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="mainPage">
      <div className="navbar">
        <Navbar />
      </div>

      {loading ? (
        <div className="rightPart">Loading...</div>
      ) : user == null ? (
        <div className="rightPart">User not found</div>
      ) : (
        <div className="rightPart">
          <div className="profile-container">
            <div className="profile-header">
              <img
                className="profile-pic"
                src={user.profilePicture}
                alt="Profile"
              />
              <div className="profile-info">
                <div className="top-row">
                  <h2>{user.username}</h2>
                  {/* <button className="edit-btn">Edit Profile</button> */}
                </div>
                <div className="stats">
                  <span>
                    <strong>{user.posts}</strong> posts
                  </span>
                  <span>
                    <strong>{user.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{user.following}</strong> following
                  </span>
                </div>
                <div className="bio">
                  <strong>{user.name}</strong>
                  <p>{user.bio}</p>
                </div>
              </div>
            </div>

            <div className="gallery">
              {posts.map((post) => (
                <img
                  className="img"
                  key={post.postId}
                  src={post.imageUrl}
                  alt={post.caption}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfoPage;
