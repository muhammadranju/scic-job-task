/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { io } from "socket.io-client";

// Connect to WebSocket server
const socket = io("http://localhost:5000"); // Adjust URL as needed

const COLUMNS = [
  { _id: "TODO", title: "To Do" },
  { _id: "IN_PROGRESS", title: "In Progress" },
  { _id: "DONE", title: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks");
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
  }, []);

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

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column._id}
              column={column}
              tasks={tasks.filter((task) => task.status === column._id)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

function Column({ column, tasks, onTaskClick }) {
  const { setNodeRef } = useDroppable({ id: column._id });

  return (
    <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onTaskClick} />
          ))
        ) : (
          <p className="text-neutral-500 text-sm">No tasks</p>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task._id)} // Call the reorder function on click
      className="cursor-pointer cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md transition-transform"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
    </div>
  );
}
