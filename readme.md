# Task Management Application

## Overview

The Task Management Application is a fully responsive web-based application that allows users to manage their tasks effectively. Users can add, edit, delete, and reorder tasks through a drag-and-drop interface while categorizing them into "To-Do," "In Progress," and "Done." The application ensures real-time synchronization, data persistence, and a seamless user experience.

## Live Demo

[Live Demo](https://task-manager-9f8db.web.app)

## Features

- **Authentication**
  - Google Sign-In via Firebase Authentication.
  - User details (User ID, email, display name) are stored upon the first login.
- **Task Management**
  - Add, edit, delete, and reorder tasks.
  - Drag-and-drop functionality for moving tasks between categories.
  - Tasks remain persistent in the database.
- **Database & Real-time Syncing**
  - Uses MongoDB with Express.js for backend storage.
  - Implements real-time updates using WebSockets or MongoDB Change Streams.
- **Frontend UI**
  - Built with Vite.js + React.
  - Uses a drag-and-drop library for seamless task movement.
  - Modern, minimalistic, and responsive design with a limited color palette.
- **Responsiveness**
  - Fully optimized for desktop and mobile devices.
- **Backend API**
  - Built with Express.js.
  - Provides CRUD operations for task management.
  - Endpoints:
    - `POST /tasks` – Add a new task.
    - `GET /tasks` – Retrieve all tasks for the logged-in user.
    - `PUT /tasks/:id` – Update task details.
    - `DELETE /tasks/:id` – Delete a task.
- **Bonus Features (Optional)**
  - Dark mode toggle.
  - Task due dates with visual indicators.
  - Simple activity log to track task changes.

## Technologies Used

### Frontend

- React (Vite.js)
- Firebase Authentication
- Drag-and-drop library dnd-kit
- Tailwind CSS / Material UI (for styling)

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose ODM)
- WebSockets / MongoDB Change Streams (for real-time updates)

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB setup
- Firebase project setup for authentication

### Steps

#### 1. Clone the repository:

```bash
git clone https://github.com/muhammadranju/scic-job-task.git
cd scic-job-task
```

#### 2. Install dependencies

##### Frontend

```bash
cd frontend
npm install
```

##### Backend

```bash
cd backend
npm install
```

#### 3. Set up environment variables

Create a `.env` file in the backend directory and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
FIREBASE_API_KEY=your_firebase_api_key

VITE_apiKey=******************
VITE_authDomain=******************
VITE_projectId=******************
VITE_storageBucket=******************
VITE_messagingSenderId=******************
VITE_appId=******************
VITE_BackendURL="https://scicc-job-task.vercel.app"
```

#### 4. Run the application

##### Start backend server

```bash
cd backend
npm start
```

##### Start frontend server

```bash
cd frontend
npm run dev
```

<!--
## Folder Structure
```
root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   ├── package.json
``` -->
