const getStatusColor = (status) => {
  switch (status) {
    case "running":
      return "text-blue-400";
    case "complete":
      return "text-green-400";
    case "failed":
      return "text-red-400";
    case "cancelled":
      return "text-gray-400";
    default:
      return "text-gray-300";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "running":
      return "Running...";
    case "complete":
      return "Completed";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Stopped (enough data)";
    default:
      return status;
  }
};

const Taskcard = ({ task }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-md border border-slate-700">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">

        <div>
          <h3 className="font-medium text-sm">{task.label}</h3>
          <p className="text-xs text-gray-400">
            Agent: {task.agent}
          </p>
        </div>

        <div className={`text-xs font-medium ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </div>

      </div>

      {/* DEPENDENCIES */}
      {task.depends_on && task.depends_on.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">
          depends on: {task.depends_on.join(", ")}
        </p>
      )}

      {/* ERROR */}
      {task.status === "failed" && task.error && (
        <p className="text-xs text-red-400 mb-2">
          ⚠ {task.error}
        </p>
      )}

      {/* CANCELLED */}
      {task.status === "cancelled" && (
        <p className="text-xs text-gray-400 mb-2">
          ⏹ Cancelled ({task.reason || "no reason"})
        </p>
      )}

      {/* OUTPUT */}
      <div className="flex flex-col gap-1 text-sm text-gray-300">

        {task.outputs.length === 0 && task.status === "running" && (
          <span className="text-xs text-gray-500 italic animate-pulse">
            processing...
          </span>
        )}

        {task.outputs.map((o, i) => (
          <p key={i}>{o}</p>
        ))}

      </div>

    </div>
  );
};

export default Taskcard;