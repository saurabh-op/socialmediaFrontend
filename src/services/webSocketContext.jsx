import React, { createContext, useContext, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);

  // Handler sets for chat and notifications
  const messageHandlersRef = useRef(new Set());
  const notificationHandlersRef = useRef(new Set());
  const feedHandlerRef = useRef(new Set());

  const connect = (userId) => {
    if (stompClientRef.current?.connected) {
      console.log("✅ WebSocket already connected");
      return;
    }

    console.log("🔌 Attempting WebSocket connection for user:", userId);
    const socket = new SockJS("http://ziffyconnect.onrender.com/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("✅ WebSocket connected successfully for user:", userId);

        // subscribe to chat messages
        client.subscribe(`/topic/${userId}/chat`, (msg) => {
          try {
            const messageData = JSON.parse(msg.body);
            console.log("📨 Received chat message via WebSocket:", messageData);
            messageHandlersRef.current.forEach((handler) => {
              try {
                handler(messageData);
              } catch (err) {
                console.error("Error in chat message handler:", err);
              }
            });
          } catch (parseErr) {
            console.error("Error parsing WebSocket message:", parseErr);
          }
        });

        // Subscribe to notifications
        client.subscribe(`/topic/${userId}/notification`, (msg) => {
          try {
            const notificationData = JSON.parse(msg.body);
            console.log(
              "🔔 Received notification via WebSocket:",
              notificationData,
            );
            notificationHandlersRef.current.forEach((handler) => {
              try {
                handler(notificationData);
              } catch (err) {
                console.error("Error in notification handler:", err);
              }
            });
          } catch (parseErr) {
            console.error("Error parsing notification:", parseErr);
          }
        });

        // subscribe to feed
        client.subscribe(`/topic/${userId}/feed`, (msg) => {
          try {
            const feedData = JSON.parse(msg.body);
            console.log("📰 Received feed message via WebSocket:", feedData);
            feedHandlerRef.current.forEach((handler) => {
              try {
                handler(feedData);
              } catch (err) {
                console.error("Error in feed message handler:", err);
              }
            });
          } catch (parseErr) {
            console.error("Error parsing feed message:", parseErr);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
        console.error("Error frame:", frame);
      },
      onWebSocketError: (event) => {
        console.error("❌ WebSocket connection error:", event);
      },
      onWebSocketClose: () => {
        console.warn("⚠️ WebSocket connection closed");
      },
    });

    try {
      client.activate();
      stompClientRef.current = client;
      console.log("🚀 WebSocket client activated");
    } catch (err) {
      console.error("❌ Error activating WebSocket client:", err);
    }
  };

  const disconnect = () => {
    ``;
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    // Clear handlers on disconnect
    messageHandlersRef.current.clear();
    notificationHandlersRef.current.clear();
    feedHandlerRef.current.clear();
  };

  // Chat message handlers
  const registerMessageHandler = (handler) => {
    messageHandlersRef.current.add(handler);
  };

  const unregisterMessageHandler = (handler) => {
    messageHandlersRef.current.delete(handler);
  };

  // Notification handlers
  const registerNotificationHandler = (handler) => {
    notificationHandlersRef.current.add(handler);
  };

  const unregisterNotificationHandler = (handler) => {
    notificationHandlersRef.current.delete(handler);
  };

  // Feed handlers
  const registerFeedHandler = (handler) => {
    feedHandlerRef.current.add(handler);
  };

  const unregisterFeedHandler = (handler) => {
    feedHandlerRef.current.delete(handler);
  };

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        disconnect,
        stompClient: stompClientRef,
        registerMessageHandler,
        unregisterMessageHandler,
        registerNotificationHandler,
        unregisterNotificationHandler,
        registerFeedHandler,
        unregisterFeedHandler,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
