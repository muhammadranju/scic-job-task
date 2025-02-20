/* eslint-disable react/prop-types */
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function Column({ column, tasks, handleTaskClick }) {
  const { setNodeRef } = useDroppable({ id: column._id });

  return (
    <div className="flex w-96 flex-col  bg-gray-800 p-5 rounded-lg shadow-md min-h-[300px]">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4 ">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              handleTaskClick={handleTaskClick}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-sm">No tasks</p>
        )}
      </div>
    </div>
  );
}

export default Column;
