import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";

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
    <div className="background">
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
  );
}

export default Feed;
