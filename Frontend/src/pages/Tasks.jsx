import { closestCenter, DndContext } from "@dnd-kit/core";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Column from "../components/Column";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

const socket = io("http://localhost:5000");

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
    navigate("/login", { replace: true });
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

  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.status) {
      alert("Please fill in all fields.");
      return;
    }

    const newTaskData = {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskData]);
    socket.emit("addTask", newTaskData);

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

    setNewTask({ title: "", description: "", status: "TODO" });
    setIsModalOpen(false);
  };

  const onDeleteTask = async (taskId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
          socket.emit("deleteTask", taskId);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onEditTask = async (taskId, updatedTask) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      socket.emit("updateTask", { taskId, updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <div className="flex justify-between items-center gap-x-5 ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-gray-100 text-gray-900 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Task
        </button>
        <div className="flex items-center flex-col gap-2 mb-5">
          <h1 className="text-2xl font-bold ">Task Manager</h1>
          <span className="font-bold">Hi!, {user?.displayName || "User"} </span>
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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((column) => (
            <Column
              key={column._id}
              column={column}
              tasks={tasks.filter((task) => task.status === column._id)}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              setTasks={setTasks}
              onDragEnd={handleDragEnd}
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
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded"
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
