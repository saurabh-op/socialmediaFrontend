import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import upload from "../../assets/upload.png";

function Feed() {
  const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulating an API call
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mainPage">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="rightPart">
        <h2>Posts</h2>
        <div>
          <PostCard />
        </div>
        <div>
          <PostCard />
        </div>
        <div>
          <PostCard />
        </div>
        <div>
          <PostCard />
        </div>
        <div>
          <PostCard />
        </div>
      </div>
    </div>
  );
}

export default Feed;
{
  /* <div className="upload">
        <button className="upload-btn">
          <strong>Upload </strong>
          <img src={upload} alt="Upload Icon" className="upload-icon" />
        </button>
      </div> */
}
