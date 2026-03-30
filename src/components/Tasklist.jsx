import Taskcard from "./taskcard";
import { useEffect, useRef } from "react";

const Tasklist = ({ tasks }) => {
  const grouped = {};
  const bottomRef = useRef();

  tasks.forEach((task) => {
    const key = task.parallel_group ?? `single-${task.id}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tasks]);

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([groupKey, group]) =>
        group.length > 1 ? (
          <div
            key={`group-${groupKey}`}
            className="border border-dashed border-slate-600 p-3 rounded"
          >
            <p className="text-xs text-gray-400 mb-2">
              Parallel Tasks
            </p>

            <div className="flex flex-col gap-2">
              {group.map((task) => (
                <Taskcard key={`task-${task.id}`} task={task} />
              ))}
            </div>
          </div>
        ) : (
          <Taskcard
            key={`task-${group[0].id}`}
            task={group[0]}
          />
        )
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default Tasklist;