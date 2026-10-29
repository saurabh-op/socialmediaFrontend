import React, { useEffect, useState, useRef } from "react";

//Web socket Services
import { useWebSocket } from "../../services/webSocketContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

//Axios
import api from "../../config/axios";
import axios from "axios";

//Css files
import "./chatList.css";
import "./chatViewPort.css";
import "./search_bar.css";
import "./layout_chat.css";

//jsx files
import ChatPlaceholder from "./openedChatPlaceholder.jsx";
import ChatListSkeleton from "./chatListPlaceholder.jsx";
import NoChatSelected from "./noChatSelected.jsx";

//Components
import { ArrowLeft, Plus, Search, X, Send } from "lucide-react";
import Navbar from "../Layout/Navbar";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

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
  const [searchNewChat, setSearchNewChat] = useState(false);
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
  const [currentReceiver_username, setcurrentReceiver_username] = useState("");
  const [currentReceiver_id, setCurrentReceiver_Id] = useState("");

  // Initialize WebSocket connection on component mount
  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid && (!stompClient.current || !stompClient.current.connected)) {
      console.log("Initializing WebSocket connection for user:", userid);
      connect(userid);
    }
  }, [connect, stompClient]);

  useEffect(() => {
    currentOtherUserRef.current = currentReceiver_username;
  }, [currentReceiver_username]);

  useEffect(() => {
    const messageHandler = (newMessage) => {
      console.log("Received message via WebSocket:", newMessage);
      console.log("Current chat ID:", currentChatid);

      // Reconstruct the chat ID from sender and current user if not provided
      let messageChatId = newMessage.chatId || newMessage.cid;
      if (!messageChatId && newMessage.sender_id) {
        const currentUserId = localStorage.getItem("userid");
        messageChatId = [currentUserId, newMessage.sender_id].sort().join("_");
        console.log("Reconstructed chat ID:", messageChatId);
      }

      console.log("Message chat ID:", messageChatId);

      // Check if the message belongs to the current chat
      if (messageChatId === currentChatid) {
        console.log("Message is for current chat, adding to history");
        setChatHistory((prev) => {
          // Deduplicate by `message_id` to avoid inserting the same message twice
          if (!newMessage || !newMessage.message_id) {
            return [newMessage, ...prev];
          }
          const exists = prev.some(
            (m) => m && m.message_id === newMessage.message_id,
          );
          if (exists) {
            console.log("Duplicate message ignored:", newMessage.message_id);
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
    console.log(userid);
    const fetchChatList = async () => {
      try {
        const res = await api.get(`/chatBook/${userid}`);
        setChatList(res.data);
        console.log(res.data);
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
    const my_local_id = localStorage.getItem("userid");
    const my_local_username = localStorage.getItem("username");
    const friends_id = userid;
    const friends_username = username;

    const sortedChatId = [my_local_id, friends_id].sort().join("_");

    const existingChat = chatList.find((chat) => chat.chatId === sortedChatId);

    if (existingChat) {
      setCurrentChatId(existingChat.chatId);
      setcurrentReceiver_username(existingChat.friends_username);
      setSearchNewChat(false);
      return;
    }

    try {
      const response = await api.get(
        `/chatKeeper/new/${my_local_id}/${my_local_username}/${friends_id}/${friends_username}`,
      );
      console.log("New chat created:", response.data);
      setCurrentChatId(response.data);
      setcurrentReceiver_username(friends_username);
      setCurrentReceiver_Id(friends_id);
      const newChat = {
        chatId: response.data,
        timeStamp: new Date().toISOString(),
        friends_username: username,
      };
      setChatList((chatList) => [newChat, ...chatList]);
      setSearchNewChat(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  function main_page() {
    return (
      <div className={`chat_mainpage ${currentChatid ? "chat-open" : ""}`}>
        {chat_list()}
        {currentChatid ? (
          opened_chat()
        ) : (
          <div className="select_a_chat">
            <NoChatSelected />
          </div>
        )}
      </div>
    );
  }
  function placeholder_main_page() {
    return (
      <div className="chat_mainpage">
        <ChatListSkeleton />
        <ChatPlaceholder />
      </div>
    );
  }
  function setChatInfo(chatId, friend_username, friend_id) {
    setChatHistory([]);
    setCurrentChatId(chatId);
    setcurrentReceiver_username(friend_username);
    setCurrentReceiver_Id(friend_id);
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
        <div className="chat_list">
          <h2 className="Message_header">
            {searchNewChat ? "New Chat" : "Messages"}
          </h2>
          <div className="searchContainer">
            <Search className="searchIcon" />
            <input
              value={searchNewChat ? search : query}
              onChange={(e) =>
                searchNewChat
                  ? setSearch(e.target.value)
                  : setQuery(e.target.value)
              }
              placeholder={searchNewChat ? "Enter username" : "Search"}
              className="searchInput"
            />
            {(searchNewChat ? search : query) && (
              <button
                onClick={() => (searchNewChat ? setSearch("") : setQuery(""))}
                className="clearBtn"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {searchNewChat ? (
            <>
              {results.length === 0 && search.trim() !== "" && (
                <p className="no-results">
                  {searching ? "Searching..." : "No users found."}
                </p>
              )}

              {Array.isArray(results) ? (
                results.map((r) => (
                  <div
                    key={r.userid}
                    className="list-item"
                    onClick={() => beginNewChat(r.userid, r.username)}
                  >
                    <div className="chat_card">
                      <div className="avatarWrapper">
                        <div className="avatar">
                          {r.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="chatInfo">
                        <div className="topRow">
                          <span className="chatUsername">{r.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : results ? (
                <div
                  className="list-Item"
                  onClick={() => beginNewChat(results.userid, results.username)}
                >
                  <div className="chat_card">
                    <div className="avatarWrapper">
                      <div className="avatar">
                        {results.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="chatInfo">
                      <div className="topRow">
                        <span className="chatUsername">{results.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            (() => {
              const filtered = query.trim()
                ? chatList.filter((chat) =>
                    (chat.friends_username || "")
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                : chatList;

              return filtered.map((chat) => (
                <div
                  key={chat.chatId}
                  className="list-item"
                  onClick={() =>
                    setChatInfo(
                      chat.chatId,
                      chat.friends_username,
                      chat.friends_id,
                    )
                  }
                >
                  <div className="chat_card">
                    <div className="avatarWrapper">
                      <div className="avatar">
                        {chat.friends_username?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="chatInfo">
                      <div className="topRow">
                        <span className="chatUsername">
                          {chat.friends_username}
                        </span>

                        <span className="chatTime">
                          {formatChatTime(chat.timeStamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })()
          )}
        </div>
        <button
          className="floatingActionBtns"
          onClick={() => setSearchNewChat(!searchNewChat)}
        >
          {searchNewChat ? <ArrowLeft size={20} /> : <Plus size={20} />}
        </button>
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
          sender_id: senderId,
          text: message,
        },
        {
          headers: {
            send_to: currentReceiver_id,
          },
        },
      )
      .then((response) => {
        console.log("Message sent successfully:", response.data);

        // Add sent message to chat history immediately
        setChatHistory((prev) => {
          const exists = prev.some(
            (m) => m && m.message_id === response.data.message_id,
          );

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
            destination: `/app/chat/${currentReceiver_username}`,
            body: JSON.stringify(messagePayload),
          });
          console.log("Message published to WebSocket:", messagePayload);
        }

        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        toast.error("Failed to send. Please try again.");
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
        {isloadingChatHistory ? (
          <ChatPlaceholder />
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <button
                className="mobile-chat-back"
                onClick={() => setCurrentChatId("")}
                aria-label="Back to messages"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="avatarWrapper">
                <div className="avatar">
                  {currentReceiver_username.charAt(0).toUpperCase()}
                </div>
              </div>
              {currentReceiver_username}
            </div>

            <div className="chat-history">
              {chatHistory && chatHistory.length > 0 ? (
                chatHistory.map((msg, index) => {
                  const mine = msg.sender_id === myUserId;

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
                        <div className="message-text">{msg.text}</div>

                        <div className="msgtimestamp">
                          {new Date(msg.time).toLocaleTimeString([], {
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
                  placeholder={`Message ${currentReceiver_username}`}
                />
                <button onClick={handleSend}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="chat-page">
      <Navbar />

      <div>
        {isLoadingChatList ? (
          <div>{placeholder_main_page()}</div>
        ) : (
          <div>{main_page()}</div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
