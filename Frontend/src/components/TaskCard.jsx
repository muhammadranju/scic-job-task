/* eslint-disable react/prop-types */
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskCard({ task, handleTaskClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "",
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const onDelete = (task) => {
    console.log("Deleting task:", task);
  };

  const onEdit = (task) => {
    console.log("Editing task:", task);
    setIsModalOpen(true);
  };

  const updateTask = async () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={() => handleTaskClick(task._id)} // Call the reorder function on click
        className={`cursor-grab rounded-lg  p-4 shadow-sm bg-gray-700 hover:shadow-md transition-transform flex justify-between items-center ${
          (task.status === "DONE" && "bg-green-600/50") ||
          (task.status === "IN_PROGRESS" && "bg-yellow-600/50")
        }`}
        style={style}
      >
        <div>
          <h3 className="font-medium text-neutral-100">{task.title}</h3>
          <p
            className={`mt-2 text-sm ${
              (task.status === "DONE" && "text-green-200") ||
              (task.status === "IN_PROGRESS" && "text-yellow-200")
            }`}
          >
            {task.description}
          </p>
        </div>
        <div className="flex gap-2 ">
          <button onClick={onEdit} className="text-green-400">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-400">
            <FaTrash />
          </button>
        </div>
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
                onClick={updateTask}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
