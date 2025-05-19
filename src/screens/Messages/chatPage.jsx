import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./chatPage.css";
import "../Layout/Common.css";
import Navbar from "../Layout/Navbar";
import axios from "axios";
import "./chatRightPart.css";
import "./chatList.css";
import "./chatViewPort.css";
import "./newChatPopUp.css";

function ChatPage() {
  const [hasMore, setHasMore] = useState(true);
  const chatHistoryRef = useRef(null);

  const [newchatid, setNewChatId] = useState("");
  const [search, setSearch] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [showNewChatPopUp, setNewSearchPopUp] = useState(false);
  const [isLoadingChatList, setisLoadingChatlist] = useState(true);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [chatListFetched, setChatListFetched] = useState(false);

  //Chat viewPort Related
  const [isloadingChatHistory, setIsLoadingChatHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentChatid, setCurrentChatId] = useState("");
  const [currentOtherUser, setcurrentOtherUser] = useState("");
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (currentChatid) {
      loadChat();
    }
  }, [currentChatid, currentPage]);
  useEffect(() => {
    const userid = localStorage.getItem("userid");

    const fetchChatList = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/chatBook/${userid}`
        );
        setChatList(res.data);
        setChatListFetched(true);
      } catch (error) {
        console.error("Error fetching chat list:", error);
        setChatList([]);
      } finally {
        setisLoadingChatlist(false);
      }
    };

    if (userid && !chatListFetched) {
      fetchChatList();
    }
  }, [chatListFetched]);

  useEffect(() => {
    let timer;
    const userid = localStorage.getItem("userid");
    const fetchData = async () => {
      try {
        if (search.trim() === "") {
          setResults([]);
        } else {
          setSearching(true);
          const res = await fetch(
            `http://localhost:8080/api/following/${userid}/${search}`
          );
          const data = await res.json();
          console.log(data);
          setResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const beginNewChat = async (userid, username) => {
    const user1 = localStorage.getItem("userid");
    const user2 = userid;

    const sortedChatId = [user1, user2].sort().join("_");

    const existingChat = chatList.find((chat) => chat.chatId === sortedChatId);

    if (existingChat) {
      setCurrentChatId(existingChat.chatId);
      setcurrentOtherUser(existingChat.otherPersonUserName);
      setNewSearchPopUp(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/chatKeeper/new/${user1}/${user2}`
      );
      console.log("New chat created:", response.data);
      setCurrentChatId(response.data);
      setcurrentOtherUser(username);
      const newChat = {
        chatId: response.data,
        timeStamp: new Date().toISOString(),
        otherPersonUserName: username,
      };
      setChatList((chatList) => [newChat, ...chatList]);
      setNewSearchPopUp(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  function searchPopUp() {
    return (
      <div className="popupContainer">
        <input
          type="text"
          className="search-input"
          placeholder="Search username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="list">
          {results.length === 0 && search.trim() !== "" && (
            <p className="no-results">
              {searching ? "Searching..." : "No users found."}
            </p>
          )}

          {results && (
            <div
              className="listItem"
              onClick={() => beginNewChat(results.userid, results.username)}
            >
              <img
                className="profilePic"
                src={results.image}
                alt="User Profile"
              />

              <div className="user-info">
                <span>
                  <strong>{results.username}</strong>
                </span>
                <span>{results.name}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <button className="backbtn" onClick={() => setNewSearchPopUp(false)}>
            Back
          </button>
        </div>
      </div>
    );
  }
  function renderChatRightPart() {
    return (
      <div className="boxer">
        {renderChatList()}
        {currentChatid ? viewChat() : "Select a chat"}
      </div>
    );
  }
  function setChatInfo(chatId, userName) {
    setChatHistory([]);
    setCurrentChatId(chatId);
    setcurrentOtherUser(userName);
    setCurrentPage(0);
  }
  function renderChatList() {
    return (
      <div className="chatListContainer">
        {showNewChatPopUp ? (
          <div>{searchPopUp()}</div>
        ) : (
          <>
            <div className="List">
              {chatList.map((chat) => (
                <div
                  key={chat.chatId}
                  className="chat-item"
                  onClick={() =>
                    setChatInfo(chat.chatId, chat.otherPersonUserName)
                  }
                >
                  <div className="chat-item-content">
                    <p className="chat-username">
                      <strong>{chat.otherPersonUserName}</strong>
                    </p>
                    <p className="chat-timestamp">
                      {new Date(chat.timeStamp).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="newChatBtn"
              onClick={() => setNewSearchPopUp(true)}
            >
              New chat
            </button>
          </>
        )}
      </div>
    );
  }

  function loadChat() {
    setIsLoadingChatHistory(true);
    axios
      .get(
        `http://localhost:8080/api/chatKeeper/${currentChatid}?page=${currentPage}`
      )
      .then((response) => {
        console.log("Chat history loaded:", response.data);
        if (response.data.length === 0) {
          setHasMore(false);
          setIsLoadingChatHistory(false);
        } else {
          setChatHistory((prev) => [...prev, ...response.data]); // Append older messages to the top
          setCurrentPage((currentPage) => currentPage + 1);
          setIsLoadingChatHistory(false);
        }
      })
      .catch((error) => {
        console.error("Failed to load chat history:", error);
        setIsLoadingChatHistory(false);
      });
  }

  function onSend(message) {
    const senderId = localStorage.getItem("userid");

    axios
      .post(
        `http://localhost:8080/api/chatKeeper/${currentChatid}`,
        {
          sid: senderId,
          tex: message,
        },
        {
          headers: {
            rid: currentOtherUser,
          },
        }
      )
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        setChatHistory((chatHistory) => [...chatHistory, response.data]); // Append new message to the bottom
        setMessage("");
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the bottom
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Failed to send the message. Please try again.");
      });
  }

  const viewChat = () => {
    const myUserId = localStorage.getItem("userid");
    const handleSend = () => {
      if (message.trim() === "") return;
      onSend(message);
    };

    return (
      <>
        {isloadingChatHistory && <div>Loading chat...</div>}
        <div>
          <div className="chat-window">
            <div className="chat-header">{currentOtherUser}</div>

            <div className="chat-history">
              {chatHistory && chatHistory.length > 0 ? (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      msg.sid === myUserId ? "my-message" : "their-message"
                    }`}
                  >
                    <div className="message-text">{msg.tex}</div>
                    <div className="timestamp">
                      {new Date(msg.tim).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div>No messages yet.</div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Type a message"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mainPage">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="rightPart">
        {isLoadingChatList ? "Loading..." : <div>{renderChatRightPart()}</div>}
      </div>
    </div>
  );
}

export default ChatPage;
