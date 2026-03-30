import { useEffect, useState, useRef } from "react";
import { runEmitter } from "./files/emitter";
import events from "./files/success.json";

import Header from "./components/Header";
import Output from "./components/output";

function App() {
  const [run, setRun] = useState(null);
  const [output, setOutput] = useState(null);
  const [time, setTime] = useState(0);
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState({});

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    runEmitter(events, handleEvent);
  }, []);

  useEffect(() => {
    if (!run || run.status !== "running") return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [run]);

  const addLog = (type, message, status = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        type,
        message,
        status
      }
    ]);
  };

  const updateTask = (task_id, updates) => {
    setTasks((prev) => {
      const existing = prev[task_id] || {
        history: []
      };

      return {
        ...prev,
        [task_id]: {
          ...existing,
          ...updates,
          history: [
            ...(existing.history || []),
            { status: updates.status, time: Date.now() }
          ]
        }
      };
    });
  };

  const handleEvent = (event) => {
    switch (event.type) {
      case "run_started":
        setRun({ query: event.query, status: "running" });
        addLog("run", `Run started: ${event.query}`, "running");
        break;

      case "task_spawned":
        updateTask(event.task_id, {
          label: event.label,
          agent: event.agent,
          status: "running",
          parallel_group: event.parallel_group
        });

        addLog("task", `Started → ${event.label}`, "running");
        break;
        case "run_error":
        setRun((prev) => ({ ...prev, status: "failed" }));
        addLog("run", event.message, "failed");
        break;

      case "task_update":
        updateTask(event.task_id, {
          status: event.status
        });

        if (event.status === "failed") {
          addLog("task", `Failed → ${event.task_id}`, "failed");
        } else if (event.status === "cancelled") {
          addLog(
            "task",
            `Stopped early → ${event.task_id}`,
            "cancelled"
          );
        } else if (event.status === "complete") {
          addLog("task", `Completed → ${event.task_id}`, "complete");
        }
        break;

      case "partial_output":
        addLog("output", event.content, event.is_final ? "complete" : "info");
        break;

      case "run_complete":
        setRun((prev) => ({ ...prev, status: "complete" }));
        setOutput(event.output.summary);
        addLog("run", "Run completed", "complete");
        break;

      default:
        break;
    }
  };

  if (!run) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 bg-black">
        No active run. Submit a query to begin.
      </div>
    );
  }

  const groupedTasks = Object.values(tasks).reduce((acc, task) => {
    const key = task.parallel_group || task.label;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      
      {/* TOP SECTION: Header & Final Result (Fixed height area) */}
      <div className="flex-none border-b border-gray-800">
        <div className="p-4 bg-black">
          <Header run={run} time={time} />
        </div>
        
        {output && (
          <div className="p-6 bg-[#0f0f0f] border-t border-gray-800 max-h-[30vh] overflow-y-auto">
            <h2 className="text-sm font-bold mb-2 text-green-400 uppercase tracking-wider">
              Final Analysis
            </h2>
            <Output output={output} />
          </div>
        )}
      </div>

      {/* MAIN GRID: 6:4 Split */}
      <div className="flex-1 grid grid-cols-10 overflow-hidden">
        
        {/* LEFT SIDE (6): Actions and Parallel Tasks */}
        <div className="col-span-6 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-800 bg-gray-900/30 text-xs font-bold text-gray-400 uppercase">
            Task Execution Flow
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
            {Object.entries(groupedTasks).map(([group, groupTasks], i) => (
              <div key={i} className="border border-gray-800 rounded bg-[#0a0a0a] p-3 shadow-sm">
                {groupTasks.length > 1 && (
                  <div className="text-[10px] text-blue-500 mb-2 font-bold uppercase">
                    Parallel Group
                  </div>
                )}

                {groupTasks.map((task, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-200">{task.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBorderColor(task.status)} ${getColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>

                    {/* RETRY HISTORY */}
                    <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <span className="opacity-50">History:</span>
                      {task.history?.map((h, i) => (
                        <span key={i} className="flex items-center">
                          {i > 0 && <span className="mx-1 text-gray-700">→</span>}
                          <span className={getColor(h.status)}>{h.status}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (4): Logs */}
        <div className="col-span-4 flex flex-col overflow-hidden bg-[#050505]">
          <div className="p-3 border-b border-gray-800 bg-gray-900/30 text-xs font-bold text-gray-400 uppercase">
            System Logs
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono">
            <LogView logs={logs} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

// Helper for status borders
const getBorderColor = (status) => {
  switch (status) {
    case "running": return "border-blue-900/50";
    case "complete": return "border-green-900/50";
    case "failed": return "border-red-900/50";
    default: return "border-gray-800";
  }
};

const getColor = (status) => {
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
      return "text-gray-400";
  }
};

const LogView = ({ logs }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="space-y-2 text-[11px]">
      {logs.map((log) => (
        <div key={log.id} className="flex flex-col border-l border-gray-800 pl-3 pb-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-gray-600 text-[10px]">
              {log.time}
            </span>
            <span className={`text-[10px] font-bold uppercase ${getColor(log.status)}`}>
              {log.status}
            </span>
          </div>
          <span className="text-gray-300 leading-relaxed">
            {log.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};