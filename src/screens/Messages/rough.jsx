import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../../services/webSocketContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../../config/axios";

import { ArrowLeft, Plus, Search, X, Send } from "lucide-react";
import "./search_bar.css";
import "./layout_chat.css";
import Navbar from "../Layout/Navbar";
import axios from "axios";

import "./chatList.css";
import "./chatViewPort.css";
import "./newChatPopUp.css";

function ChatPage() {
  const [hasMore, setHasMore] = useState(true);
  const chatHistoryRef = useRef(null);

  const currentOtherUserRef = useRef("");
  const {
    registerMessageHandler,
    unregisterMessageHandler,
    connect,
    stompClient,
  } = useWebSocket();

  const [newchatid, setNewChatId] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
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

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid && (!stompClient.current || !stompClient.current.connected)) {
      console.log("Initializing WebSocket connection for user:", userid);
      connect(userid);
    }
  }, [connect, stompClient]);

  useEffect(() => {
    currentOtherUserRef.current = currentOtherUser;
  }, [currentOtherUser]);

  useEffect(() => {
    const messageHandler = (newMessage) => {
      console.log("Received message via WebSocket:", newMessage);
      console.log("Current chat ID:", currentChatid);

      // Reconstruct the chat ID from sender and current user if not provided
      let messageChatId = newMessage.chatId || newMessage.cid;
      if (!messageChatId && newMessage.sid) {
        const currentUserId = localStorage.getItem("userid");
        messageChatId = [currentUserId, newMessage.sid].sort().join("_");
        console.log("Reconstructed chat ID:", messageChatId);
      }

      console.log("Message chat ID:", messageChatId);

      // Check if the message belongs to the current chat
      if (messageChatId === currentChatid) {
        console.log("Message is for current chat, adding to history");
        setChatHistory((prev) => {
          // Deduplicate by `mid` to avoid inserting the same message twice
          if (!newMessage || !newMessage.mid) {
            return [newMessage, ...prev];
          }
          const exists = prev.some((m) => m && m.mid === newMessage.mid);
          if (exists) {
            console.log("Duplicate message ignored:", newMessage.mid);
            return prev;
          }
          return [newMessage, ...prev];
        });
      }
    };

    registerMessageHandler(messageHandler);
    return () => unregisterMessageHandler(messageHandler);
  }, [registerMessageHandler, unregisterMessageHandler, currentChatid]);

  useEffect(() => {
    if (currentChatid) {
      loadChat();
    }
  }, [currentChatid, currentPage]);
  useEffect(() => {
    const userid = localStorage.getItem("userid");

    const fetchChatList = async () => {
      try {
        const res = await api.get(`/chatBook/${userid}`);
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
          const res = await api.get(`/following/${userid}/${search}`);
          const data = res.data;
          console.log("Search response:", data);
          setResults(data || []);
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
      const response = await api.get(`/chatKeeper/new/${user1}/${user2}`);
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

          {Array.isArray(results) ? (
            results.map((r) => (
              <div
                key={r.userid || r.id}
                className="listItem"
                onClick={() => beginNewChat(r.userid, r.username)}
              >
                <img className="profilePic" src={r.image} alt="User Profile" />

                <div className="user-info">
                  <span>
                    <strong>{r.username}</strong>
                  </span>
                  <span>{r.name}</span>
                </div>
              </div>
            ))
          ) : results ? (
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
          ) : null}
        </div>

        <div>
          <button className="backbtn" onClick={() => setNewSearchPopUp(false)}>
            Back
          </button>
        </div>
      </div>
    );
  }
  function main_page() {
    return (
      <div className="chat_mainpage">
        {chat_list()}
        {currentChatid ? (
          opened_chat()
        ) : (
          <div className="select_a_chat">Say Hi to a friend.</div>
        )}
      </div>
    );
  }
  function setChatInfo(chatId, userName) {
    setChatHistory([]);
    setCurrentChatId(chatId);
    setcurrentOtherUser(userName);
    console.log("Other user set to:", userName);
    setCurrentPage(0);
  }

  function formatChatTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);

    const diffMs = now - date;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // less than 1 hour
    if (minutes < 60) {
      return `${minutes}m`;
    }

    // less than 24 hours
    if (hours < 24) {
      return `${hours}h`;
    }

    // days
    if (days < 7) {
      return `${days}d`;
    }

    // fallback date
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  function chat_list() {
    return (
      <div className="chatListContainer">
        {showNewChatPopUp ? (
          <div>{searchPopUp()}</div>
        ) : (
          <>
            <div className="chat_list">
              <h2 className="Message_header">
                {showNewChatPopUp}?(New Chat):(Messages)
              </h2>
              <div className="searchContainer">
                <Search className="searchIcon" />
                <input
                  value={showNewChatPopUp ? search : query}
                  onChange={(e) =>
                    showNewChatPopUp
                      ? setSearch(e.target.value)
                      : setQuery(e.target.value)
                  }
                  placeholder="Search"
                  className="searchInput"
                />
                {showNewChatPopUp}?(
                {(search || query) && (
                  <button
                    onClick={() =>
                      showNewChatPopUp ? setSearch("") : setQuery("")
                    }
                    className="clearBtn"
                  >
                    <X size={16} />
                  </button>
                )}
                ):( ){showNewChatPopUp}? (
                <button
                  className="newChatBtn"
                  onClick={() => setNewSearchPopUp(true)}
                >
                  <Plus size={16} />
                </button>
                ):(
                <button
                  className="newChatBtn"
                  onClick={() => setNewSearchPopUp(false)}
                >
                  <ArrowLeft size={16} />
                </button>
                )
              </div>
              {showNewChatPopUp}? (
              {results.length === 0 && search.trim() !== "" && (
                <p className="no-results">
                  {searching ? "Searching..." : "No users found."}
                </p>
              )}
              {Array.isArray(results) ? (
                results.map((r) => (
                  <div
                    key={r.userid || r.id}
                    className="list-item"
                    onClick={() => beginNewChat(r.userid, r.username)}
                  >
                    <div className="chat_card">
                      <div className="avatarWrapper">
                        <img
                          className="profilePic"
                          src={r.image}
                          alt="User Profile"
                        />
                      </div>
                      <div className="chatInfo">
                        <div className="topRow">
                          <span>{r.name}</span>
                          <span className="chatUsername">{r.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : results ? (
                <div
                  className="listItem"
                  onClick={() => beginNewChat(results.userid, results.username)}
                >
                  <div className="chat_card">
                    <div className="avatarWrapper">
                      <img
                        className="profilePic"
                        src={results.image}
                        alt="User Profile"
                      />
                    </div>
                    <div className="chatInfo">
                      <div className="topRow">
                        <span>{results.name}</span>
                        <span className="chatUsername">{results.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              ):
              {(() => {
                const filtered = query.trim()
                  ? chatList.filter((chat) =>
                      (chat.otherPersonUserName || "")
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                    )
                  : chatList;

                return filtered.map((chat) => (
                  <div
                    key={chat.chatId}
                    className="list-item"
                    onClick={() =>
                      setChatInfo(chat.chatId, chat.otherPersonUserName)
                    }
                  >
                    <div className="chat_card">
                      <div className="avatarWrapper">
                        <div className="avatar">
                          {chat.otherPersonUserName?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="chatInfo">
                        <div className="topRow">
                          <span className="chatUsername">
                            {chat.otherPersonUserName}
                          </span>

                          <span className="chatTime">
                            {formatChatTime(chat.timeStamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </>
        )}
      </div>
    );
  }

  function loadChat() {
    setIsLoadingChatHistory(true);
    api
      .get(`/chatKeeper/${currentChatid}?page=${currentPage}`)
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

    // First, send message via HTTP to save to database
    api
      .post(
        `/chatKeeper/${currentChatid}`,
        {
          sid: senderId,
          tex: message,
        },
        {
          headers: {
            rid: currentOtherUser,
          },
        },
      )
      .then((response) => {
        console.log("Message sent successfully:", response.data);

        // Add sent message to chat history immediately
        setChatHistory((prev) => {
          const exists = prev.some((m) => m && m.mid === response.data.mid);

          if (exists) {
            return prev;
          }

          return [response.data, ...prev];
        });

        // Also send via WebSocket to recipient in real-time
        if (stompClient.current && stompClient.current.connected) {
          const messagePayload = {
            ...response.data,
            chatId: currentChatid,
          };
          stompClient.current.publish({
            destination: `/app/chat/${currentOtherUser}`,
            body: JSON.stringify(messagePayload),
          });
          console.log("Message published to WebSocket:", messagePayload);
        }

        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Failed to send the message. Please try again.");
      });
  }

  const opened_chat = () => {
    const myUserId = localStorage.getItem("userid");
    const handleSend = () => {
      if (message.trim() === "") return;
      onSend(message);
    };

    return (
      <>
        {isloadingChatHistory && <div>Hang on a moment ...</div>}
        <div>
          <div className="chat-window">
            <div className="chat-header">
              {" "}
              <div className="avatarWrapper">
                <div className="avatar">
                  {currentOtherUser.charAt(0).toUpperCase()}
                </div>
              </div>
              {currentOtherUser}
            </div>

            <div className="chat-history">
              {chatHistory && chatHistory.length > 0 ? (
                chatHistory.map((msg, index) => {
                  const mine = msg.sid === myUserId;

                  return (
                    <div
                      key={index}
                      className={`message-row ${mine ? "me" : "them"}`}
                    >
                      <div
                        className={`chat-message ${
                          mine ? "my-message" : "their-message"
                        }`}
                      >
                        <div className="message-text">{msg.tex}</div>

                        <div className="msgtimestamp">
                          {new Date(msg.tim).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-user-selected">No messages yet</div>
              )}
            </div>
            <div className="chat-bottom">
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
                  placeholder={`Message ${currentOtherUser}`}
                />
                <button onClick={handleSend}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <Navbar />

      <div>{isLoadingChatList ? "Loading..." : <div>{main_page()}</div>}</div>
    </div>
  );
}

export default ChatPage;
