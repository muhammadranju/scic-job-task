/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

// Connect to WebSocket server
const socket = io("http://localhost:5000"); // Change this URL to your backend

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

const TaskItem = ({ task, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex justify-between items-center"
    >
      <div>
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p className="text-sm text-gray-400">{task.description}</p>
        <p className="text-xs text-gray-500">📅 {task.date}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(task)} className="text-green-400">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(task.id)} className="text-red-400">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
  });
  console.log(newTask);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks");
        const data = await response.json();
        // console.log("Fetched tasks:", data.data); // Debugging line
        // Ensure data is correctly structured
        if (data.data) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
    socket.emit("fetchTasks");

    socket.on("tasksUpdated", (updatedTasks) => {
      console.log("Received updated tasks:", updatedTasks); // Debugging line
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceCategory = null;
    let destinationCategory = null;

    // Identify source and destination categories
    Object.keys(tasks).forEach((category) => {
      if (tasks[category].find((task) => task.id === activeId)) {
        sourceCategory = category;
      }
      if (tasks[category].find((task) => task.id === overId)) {
        destinationCategory = category;
      }
    });

    if (!sourceCategory) return;
    if (!destinationCategory) destinationCategory = sourceCategory;

    const sourceTasks = [...tasks[sourceCategory]];
    const destinationTasks = [...tasks[destinationCategory]];

    const oldIndex = sourceTasks.findIndex((task) => task.id === activeId);
    const newIndex = destinationTasks.findIndex((task) => task.id === overId);

    let updatedTasks = { ...tasks };

    if (sourceCategory === destinationCategory) {
      updatedTasks[sourceCategory] = arrayMove(sourceTasks, oldIndex, newIndex);
    } else {
      const [movedTask] = sourceTasks.splice(oldIndex, 1);
      destinationTasks.push(movedTask);

      updatedTasks[sourceCategory] = sourceTasks;
      updatedTasks[destinationCategory] = destinationTasks;
    }

    setTasks(updatedTasks);
    socket.emit("updateTasks", updatedTasks); // Emit changes to the backend
  };

  const addTask = () => {
    const newTaskData = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      date: new Date().toISOString().split("T")[0],
      category: newTask.category,
    };

    const updatedTasks = { ...tasks };
    updatedTasks[newTask.category].push(newTaskData);

    setTasks(updatedTasks);
    socket.emit("updateTasks", updatedTasks); // Emit new task to backend

    setNewTask({ title: "", description: "", category: "To-Do" });
    setIsModalOpen(false);
  };

  // const onEdit = (task) => {
  //   console.log("Editing task:", task);
  // };

  const onDelete = (taskId) => {
    const updatedTasks = { ...tasks };
    const category = Object.keys(updatedTasks).find((category) =>
      updatedTasks[category].some((task) => task.id === taskId)
    );
    updatedTasks[category] = updatedTasks[category].filter(
      (task) => task.id !== taskId
    );

    setTasks(updatedTasks);
    socket.emit("updateTasks", updatedTasks); // Emit changes to the backend
  };
  // console.log(newTas,.k);
  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
      >
        <FaPlus /> Add Task
      </button>
      {/* <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {tasks?.map((category) => (
          <div
            key={category}
            className="bg-gray-800 p-5 rounded-lg shadow-md min-h-[300px]"
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-300">
              {category}
            </h2>
            <SortableContext
              items={tasks[category]?.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks[category].map((task) => (
                <TaskItem key={task.id} task={task} onDelete={onDelete} />
              ))}
            </SortableContext>
          </div>
        ))}
      </div>
      {/* </DndContext> */}

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
              value={newTask.category}
              onChange={(e) =>
                setNewTask({ ...newTask, category: e.target.value })
              }
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
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
};

export default Home;
