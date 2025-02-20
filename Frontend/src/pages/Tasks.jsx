import { DndContext } from "@dnd-kit/core";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Column from "../components/Column";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { RiLogoutCircleRLine } from "react-icons/ri";

// Connect to WebSocket server
const socket = io("http://localhost:5000"); // Adjust URL as needed

const COLUMNS = [
  { _id: "TODO", title: "To Do" },
  { _id: "IN_PROGRESS", title: "In Progress" },
  { _id: "DONE", title: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "",
  });
  const { user, signOut } = useContext(AuthContext);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.data) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();

    // Listen for real-time updates
    socket.on("tasksUpdated", (updatedTasks) => {
      console.log("Received updated tasks:", updatedTasks);
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated");
    };
  }, [token, newTask]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
    });

    socket.emit("updateTaskStatus", { taskId, newStatus });
  }

  function handleTaskClick(taskId) {
    setTasks((prevTasks) => {
      // Find the clicked task
      const taskIndex = prevTasks.findIndex((task) => task._id === taskId);
      if (taskIndex === -1) return prevTasks;

      const clickedTask = prevTasks[taskIndex];

      // Filter out the clicked task and bring it to the front of its column
      const updatedTasks = [
        clickedTask, // Move clicked task to the top
        ...prevTasks.filter(
          (task) => task._id !== taskId || task.status !== clickedTask.status
        ),
      ];

      return updatedTasks;
    });

    socket.emit("reorderTask", { taskId });
  }

  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.status) {
      alert("Please fill in all fields.");
      return;
    }

    const newTaskData = {
      // _id: Date.now().toString(), // Temporary ID for UI update
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
    };

    // Update UI immediately
    setTasks((prevTasks) => [...prevTasks, newTaskData]);
    // Emit event to update other clients
    socket.emit("addTask", newTaskData);

    // API Call to save task in the database (you will implement this)
    try {
      await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTaskData),
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }

    // Reset form & close modal
    setNewTask({ title: "", description: "", status: "TODO" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <div className="flex justify-between items-center gap-x-5 ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
        >
          <FaPlus /> Add Task
        </button>
        <div className="flex items-center flex-col gap-2 mb-5">
          <h1 className="text-2xl font-bold ">Task Manager</h1>
          <span className="font-bold">Hi!, {user?.displayName}</span>
        </div>
        <button
          onClick={signOut}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
        >
          <RiLogoutCircleRLine />
          LogOut
        </button>
      </div>
      <div className="flex lg:flex-row flex-col gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column._id}
              column={column}
              tasks={tasks.filter((task) => task.status === column._id)}
              handleTaskClick={handleTaskClick}
            />
          ))}
        </DndContext>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Task</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            ></textarea>
            <select
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
            >
              <option defaultChecked>Status</option>
              <option value="TODO">To-Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
