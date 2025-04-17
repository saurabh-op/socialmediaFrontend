import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "../cssFiles/chatPage.css";

function ChatPage() {
  const [username, setUsername] = useState(""); // 👈 Fix 1
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const handleChange = (e) => {
    setUsername(e.target.value); // 👈 Fix 2
    console.log(e.target.value);
  };
  // Connect to WebSocket when component mounts
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws"); // Your Spring Boot WebSocket URL
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");
        // Subscribe to messages
        client.subscribe("/topic/chat", (message) => {
          const chat = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, chat]); // Append new message
        });
      },
      onConnectError: (error) => {
        console.error("Line down h : ", error);
      },
      debug: (str) => console.log(str),
    });
    client.activate();
    setStompClient(client);

    return () => {
      // Clean up on unmount
      client.deactivate();
    };
  }, []);

  // Handle message send
  const sendMessage = () => {
    if (message.trim()) {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          sender: username || "Anonymous",
          content: message,
          timestamp: new Date().toISOString(),
          type: "CHAT"
        }),
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={handleChange}
        required
      />

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
