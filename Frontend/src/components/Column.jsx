/* eslint-disable react/prop-types */
import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

function Column({
  column,
  tasks,
  setTasks,
  onDeleteTask,
  onEditTask,
  setUpdateStatus,
}) {
  const { setNodeRef } = useDroppable({ id: column._id });

  return (
    <div className="flex w-96 flex-col bg-gray-800 p-5 rounded-lg shadow-md min-h-[300px]">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      <SortableContext items={tasks} strategy={horizontalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                setTasks={setTasks}
                setUpdateStatus={setUpdateStatus}
              />
            ))
          ) : (
            <p className="text-neutral-500 text-sm">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;
