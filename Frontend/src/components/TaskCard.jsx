/* eslint-disable react/prop-types */

import { useDraggable } from "@dnd-kit/core";
import { Reorder } from "framer-motion";

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskCard({
  task,
  onDeleteTask,
  onEditTask,
  setTasks,
  setUpdateStatus,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });
  const token = localStorage.getItem("token");

  const [mouseIsOver, setMouseIsOver] = useState(false);

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const handleDelete = () => {
    onDeleteTask(task._id);
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    onEditTask(task._id, editedTask);
    setIsModalOpen(false);
  };

  const handelStatusUpdate = async (taskId, status) => {
    // onEditTask(taskId, JSON.stringify({ status }));
    // console.log(taskId);
    // console.log(status);
    try {
      const getTask = await fetch(
        `${import.meta.env.VITE_BackendURL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (getTask.ok) {
        setUpdateStatus(true);
        console.log("ok");
      }
      const data = await getTask.json();
      console.log(data);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...status } : task
        )
      );
      setUpdateStatus(false);
      // socket.emit("updateTask", { taskId, getTask });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <Reorder.Group values={task} onReorder={setTasks}>
        <Reorder.Item value={task} key={task._id}>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            className={`cursor-grab rounded-lg p-4 shadow-sm bg-gray-700 hover:shadow-md transition-transform flex justify-between items-center ${
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
              {/* {console.log(task._id)} */}
              <button
                onClick={() =>
                  handelStatusUpdate(
                    task._id,
                    task.status === "TODO" ? "IN_PROGRESS" : "DONE"
                  )
                }
                className={`p-[3px] px-2 text-sm mt-2 rounded-md ${
                  (task.status === "DONE" && "hidden") ||
                  (task.status === "TODO" && "bg-yellow-400 text-gray-800") ||
                  (task.status === "IN_PROGRESS" &&
                    "bg-green-400 text-gray-900")
                } bg-gray-100 text-gray-900`}
              >
                {(task.status === "TODO" && "Mark as In Progress") ||
                  (task.status === "IN_PROGRESS" && "Mark as Done")}
              </button>
            </div>
            {mouseIsOver && (
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
        </Reorder.Item>
      </Reorder.Group>

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
            <select
              className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({ ...editedTask, status: e.target.value })
              }
            >
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
                onClick={handleUpdate}
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
