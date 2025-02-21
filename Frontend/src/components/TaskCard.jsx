/* eslint-disable react/prop-types */
import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskCard({ task, onDeleteTask, onEditTask }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        touchAction: "none",
      }
    : { touchAction: "none" }; // Prevents touch scrolling interference

  const handleDelete = () => {
    onDeleteTask(task._id);
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg p-4 shadow-sm bg-gray-700 hover:shadow-md transition-transform flex justify-between items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Draggable area (only the left side) */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab flex-1 active:cursor-grabbing select-none"
        >
          <h3 className="font-medium text-neutral-100">{task.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
        </div>

        {/* Buttons (Non-Draggable) */}
        {isHovered && (
          <div className="flex gap-2">
            <button onClick={handleEdit} className="text-green-400 p-2">
              <FaEdit className="text-2xl" />
            </button>
            <button onClick={handleDelete} className="text-red-400 p-2">
              <FaTrash className="text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEditTask(task._id, editedTask);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
