## 🚀 Live Demo

- **Live Application:** https://socialmedia-frontend-fawn.vercel.app/
- **Frontend Repository:** https://github.com/saurabh-op/socialmediaFrontend
- **Backend Repository:** https://github.com/saurabh-op/socialMediaBackend

> **Note:** The backend is hosted on a free-tier service, so the first Login/Sign Up request may take a few seconds while the server wakes up.

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 📖 Overview

A modern full-stack social media platform designed to deliver a seamless and interactive user experience through secure media sharing, personalized feeds, and real-time communication. The application enables users to connect, share content, interact through likes, discover other users, and exchange instant messages while demonstrating production-oriented software engineering practices.

Built with **React**, **Spring Boot**, and **MongoDB**, the platform follows a layered backend architecture (Controllers, Services, and Repositories) with **45+ RESTful APIs**. **WebSockets (STOMP + SockJS)** power real-time messaging, while **AWS S3** securely stores media assets and MongoDB manages application data and metadata.

To optimize performance, images are cropped and compressed on the client before upload. The project demonstrates practical experience in designing and deploying a scalable full-stack application with cloud storage integration, real-time communication, and clean backend architecture.


## 🏗️ System Architecture

The application follows a client-server architecture with separate frontend and backend services. The frontend communicates with the backend through REST APIs for standard operations and WebSockets for real-time messaging.The crucial post-upload and **content delivery** and **real-time messaging** pipelines **are explained below**.


| Component | Responsibility |
|-----------|----------------|
| **React + Vite Frontend** | User interface, routing, state management, API integration |
| **Spring Boot Backend** | Business logic, authentication, REST APIs, WebSocket server |
| **MongoDB Atlas** | Stores users, posts, chats, notifications, and metadata |
| **AWS S3** | Stores profile images and post media |
| **JWT Authentication** | Secures protected API endpoints |
| **WebSocket (STOMP + SockJS)** | Enables real-time chat and instant message delivery |

### General Request Flow

1. User performs an action in the React frontend.
2. Frontend sends a REST API request to the Spring Boot backend.
4. Data is stored or retrieved from MongoDB.
5. Images are uploaded to AWS S3, while only their URLs are stored in MongoDB.
6. Backend returns the response to the frontend.
7. For chat, WebSocket connections deliver messages instantly without polling.

## 1.  📤 Post Upload & Content Delivery Flow

The post publishing pipeline is orchestrated by the **Post Dispatcher**, which coordinates media storage, metadata persistence, feed generation, notifications, and real-time updates. Instead of directly storing media in the database, images are uploaded to **AWS S3**, while only their metadata and media references are persisted in **MongoDB**.

<p align="center">
  <img src="./src/readmeasset/Post_upload_AWS_flow.png" width="900" alt="Post Upload Flow"/>
</p>

### Why this approach?


- Client-side image compression before upload
- Scalable media storage using AWS S3
- Lightweight MongoDB documents storing only metadata and media references
- Centralized orchestration through the **Post Dispatcher**
- Automatic feed generation for followers
- Real-time notifications using WebSockets (STOMP + SockJS)
- Automatic initialization of likes metadata for every new post
- Event-driven architecture that can be extended for analytics, moderation, or recommendation services


## 2.  💬 Real-Time Chat Pipeline

The messaging system combines **REST APIs**, **MongoDB**, and **WebSockets (STOMP + SockJS)** to provide reliable message persistence with instant real-time delivery. Messages are first stored in the database and then pushed to subscribed clients over WebSockets.

<p align="center">
  <img src="./src/readmeasset/Chat_websocket_flow.png" width="900" alt="Real-Time Chat Workflow"/>
</p>


### Why This Approach?

- Ensures reliable message delivery by persisting data before broadcasting.
- Uses persistent WebSocket connections for low-latency communication.
- Deterministic chat IDs prevent duplicate conversations between users.
- Supports offline users through persistent MongoDB chat history.
- Clean separation of responsibilities between REST (storage) and WebSockets (real-time delivery).

## Additional Workflows

| Workflow | Overview |
|----------|----------|
| ❤️ **Like System** | • Like/unlike posts with a single click.<br>• Like metadata is updated in MongoDB.<br>• UI reflects changes immediately. 
| 📰 **Feed Generation** | • Personalized feeds are maintained for every user.<br>• Feed Dispatcher propagates newly published posts.<br>• Connected users receive live feed updates. |
| 🔍 **User Search** | • Search users by username.<br>• Results update dynamically as users type.<br>• Direct navigation to user profiles. |
| 👤 **Profile Management** | • Update profile details and profile picture.<br>• Images are stored in AWS S3 and metadata in MongoDB.<br>• Changes are reflected across the platform. |
| 👥 **Follow System** | • Follow or unfollow other users.<br>• Relationships are stored in MongoDB.<br>• New posts are propagated through the Feed Dispatcher. |

## 🗄️ MongoDB Collection Design
| **Chat Repository** | **Feed Repository** |
|:-------------------:|:-------------------:|
| <img src="./src/readmeasset/chatRepo.jpg" width="450"/> | <img src="./src/readmeasset/feedRepo.jpg" width="450"/> |
| **User Repository** | **Media Repository** |
| <img src="./src/readmeasset/userRepo.jpg" width="450"/> | <img src="./src/readmeasset/mediaRepo.jpg" width="450"/> |
| **Connections Repository** | **Interaction Repository** |
| <img src="./src/readmeasset/connectionsRepo.jpg" width="450"/> | <img src="./src/readmeasset/interactionRepo.jpg" width="450"/> |

## ✨ Features & Screenshots

- Secure user authentication
- Create, edit and delete posts
- AWS S3 media storage
- Real-time chat using WebSockets
- Personalized feed generation
- Like, comment and follow system
- Real-time notifications
- User search and profile management

| Home | Search |
|:----:|:------:|
| <img src="./src/readmeasset/feed.png" width="450"/> | <img src="./src/readmeasset/search.png" width="450"/> |
| **Message** | **Chat** |
| <img src="./src/readmeasset/message.png" width="450"/> | <img src="./src/readmeasset/chat.png" width="450"/> |
| **Post Details** | **Profile** |
| <img src="./src/readmeasset/postdetails.png" width="450"/> | <img src="./src/readmeasset/profile.png" width="450"/> |

---

## 👨‍💻 Author

**Saurabh Tripathi** 

*M.Tech CSE '27, NIT Calicut*

Contact: **saurabh2002oct13@gmail.com**  

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/saurabh-op)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/tsaurabh1305)

