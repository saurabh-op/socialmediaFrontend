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

  const connect = (userId) => {
    if (stompClientRef.current?.connected) return;

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe(`/topic/${userId}/chat`, (msg) => {
          const messageData = JSON.parse(msg.body);
          console.log("Received chat message via ws:", messageData);
          messageHandlersRef.current.forEach((handler) => {
            try {
              handler(messageData);
            } catch (err) {
              console.error("Error in chat message handler:", err);
            }
          });
        });

        // Subscribe to notifications
        client.subscribe(`/topic/${userId}/notification`, (msg) => {
          const notificationData = JSON.parse(msg.body);
          notificationHandlersRef.current.forEach((handler) => {
            try {
              handler(notificationData);
            } catch (err) {
              console.error("Error in notification handler:", err);
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("❌ WebSocket connection error:", event);
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  const disconnect = () => {``
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    // Clear handlers on disconnect
    messageHandlersRef.current.clear();
    notificationHandlersRef.current.clear();
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
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
