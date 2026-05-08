import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import Navbar from "../Layout/Navbar";
import "./layout_feed.css";
import "./Feed.css";
import ImagePicker from "./ImagePicker";
import { useWebSocket } from "../../services/webSocketContext";

function Feed() {
  const { registerFeedHandler, unregisterFeedHandler } = useWebSocket();

  const [userid, setUserid] = useState();
  const [showPicker, setShowPicker] = useState(false);

  //Related to feed :
  const [isFeedLoading, setisFeedLoading] = useState(false);
  const [feedList, setFeedList] = useState([]);
  const [selectedPostCommentsList, setSelectedPostCommentsList] = useState([]);
  const [selectedPostLikeList, setSelectedPostLikeList] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    console.log("geeting feed of ", userId);

    const fetchFeed = async () => {
      try {
        setisFeedLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/feed/feedPosts/${userId}`,
        );
        const data = await response.json();
        console.log("feed data", data);
        setFeedList(data || []);
      } catch (error) {
        console.error("Error fetching feed:", error);
        setFeedList([]);
      } finally {
        setisFeedLoading(false);
      }
    };

    fetchFeed();
  }, []);

  useEffect(() => {
    const handleNewFeedPost = (newPost) => {
      setFeedList((prev) => [newPost, ...prev]);
    };

    registerFeedHandler(handleNewFeedPost);
    return () => unregisterFeedHandler(handleNewFeedPost);
  }, [registerFeedHandler, unregisterFeedHandler]);

  function userFeed() {
    return (
      <div>
        {isFeedLoading ? (
          "Loading ..."
        ) : (
          <div className="feed-list-scrollable">
            {Array.isArray(feedList) && feedList.length > 0 ? (
              feedList.map((post, index) => (
                <div key={post.postId || index}>
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="no-feed-message">No posts to show.</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mainpage">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="rightSide">
        {showPicker ? (
          <div className="imagePicker">
            <button className="back-btn" onClick={() => setShowPicker(false)}>
              Go Back
            </button>
            <ImagePicker />
          </div>
        ) : (
          <div>
            {userFeed()}
            <div>
              <button
                onClick={() => setShowPicker(true)}
                className="upload-btn"
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
