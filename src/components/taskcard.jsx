const getStatusColor = (status) => {
  switch (status) {
    case "running":
      return "text-blue-400";
    case "complete":
      return "text-green-400";
    case "failed":
      return "text-red-400";
    case "cancelled":
      return "text-gray-400"; // IMPORTANT: neutral
    default:
      return "text-gray-300";
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case "running":
      return "bg-blue-900/20";
    case "complete":
      return "bg-green-900/20";
    case "failed":
      return "bg-red-900/20";
    case "cancelled":
      return "bg-gray-700/20";
    default:
      return "bg-slate-800";
  }
};

const Taskcard = ({ task }) => {
  return (
    <div
      className={`p-4 rounded-md border border-slate-700 ${getStatusBg(
        task.status
      )}`}
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-start mb-2">

        {/* LEFT */}
        <div>
          <h3 className="font-medium text-sm">{task.label}</h3>
          <p className="text-xs text-gray-400">
            Agent: {task.agent}
          </p>
        </div>

        {/* RIGHT STATUS */}
        <div className={`text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </div>

      </div>

      {/* DEPENDENCY (subtle, optional) */}
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

      {/* OUTPUTS */}
      <div className="flex flex-col gap-1 text-sm text-gray-300">

        {task.outputs.length === 0 && task.status === "running" && (
          <p className="text-xs text-gray-500 italic">
            processing...
          </p>
        )}

        {task.outputs.map((o, i) => (
          <p key={i}>{o}</p>
        ))}

      </div>

    </div>
  );
};

export default Taskcard;