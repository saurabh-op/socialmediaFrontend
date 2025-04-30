import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import upload from "../../assets/upload.png";
import "./Feed.css";
import ImagePicker from "./imagePicker";

function Feed() {
  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userid, setUserid] = useState();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
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

  // const createPost = async () => {
  //   try {
  //     const id = localStorage.getItem("id");
  //     setUserid(id);
  //     console.log("creating post the id is:");
  //     console.log(id);
  //     const response = await fetch(
  //       `http://localhost:8080/api/posts/${userid}/addPost`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           owner: userid,
  //         }),
  //       }
  //     );
  //     const result = await response.json();
  //     if (response.ok) {
  //       alert("Post created");
  //     } else {
  //       console.error("Error creating post:", result);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <div className="mainPage">
      <div className="navbar">
        <Navbar />
        <div >
          <button onClick={() => setShowPicker(true)} className="upload-btn">
            Upload
          </button>
        </div>
      </div>
      <div className="rightPart">
        {showPicker ? (
          <div className="imagePicker">
            <button className="back-btn" onClick={() => setShowPicker(false)}>
              Go Back
            </button>

            <ImagePicker />
          </div>
        ) : (
          <div>
            <h2>Posts</h2>
            {isLoading ? (
              "Loading ..."
            ) : (
              <div>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
