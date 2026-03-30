import Taskcard from "./taskcard";

const Tasklist = ({ tasks }) => {
  const grouped = {};

  tasks.forEach((task) => {
    const key = task.parallel_group ?? `single-${task.id}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  });

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([groupKey, group]) =>
        group.length > 1 ? (
          <div
            key={`group-${groupKey}`}   // ✅ stable key
            className="border border-dashed border-slate-600 p-3 rounded"
          >
            <p className="text-xs text-gray-400 mb-2">
              Parallel Tasks
            </p>

            <div className="flex flex-col gap-2">
              {group.map((task) => (
                <Taskcard
                  key={`task-${task.id}`}   // ✅ unique
                  task={task}
                />
              ))}
            </div>
          </div>
        ) : (
          <Taskcard
            key={`task-${group[0].id}`}   // ✅ unique
            task={group[0]}
          />
        )
      )}
    </div>
  );
};

export default Tasklist;