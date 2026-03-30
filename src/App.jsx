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

  const hasRun = useRef(false);

  // 🚀 Prevent double run (React StrictMode fix)
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    runEmitter(events, handleEvent);
  }, []);

  // ⏱ Timer
  useEffect(() => {
    if (!run || run.status !== "running") return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [run]);

  // 🧠 Add log entry
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

  // ⚡ Event handler
  const handleEvent = (event) => {
    switch (event.type) {
      case "run_started":
        setRun({ query: event.query, status: "running" });
        addLog("run", `Run started: ${event.query}`, "running");
        break;

      case "agent_thought":
        addLog("thought", `💡 ${event.thought}`, "info");
        break;

      case "task_spawned":
        addLog(
          "task",
          `Task started → ${event.label} (${event.agent})`,
          "running"
        );
        break;

      case "task_update":
        if (event.status === "failed") {
          addLog(
            "task",
            `❌ Task failed → ${event.task_id}: ${event.error}`,
            "failed"
          );
        } else if (event.status === "cancelled") {
          addLog(
            "task",
            `⚠ Task cancelled → ${event.task_id} (${event.reason})`,
            "cancelled"
          );
        } else if (event.status === "complete") {
          addLog(
            "task",
            `✅ Task completed → ${event.task_id}`,
            "complete"
          );
        } else {
          addLog(
            "task",
            `⏳ Task running → ${event.task_id}`,
            "running"
          );
        }
        break;

      case "partial_output":
        addLog(
          "output",
          event.content,
          event.is_final ? "complete" : "info"
        );
        break;

      case "run_complete":
        setRun((prev) => ({ ...prev, status: "complete" }));
        setOutput(event.output.summary);
        addLog("run", "🎉 Run completed successfully", "complete");
        break;

      default:
        break;
    }
  };

  // ❌ Empty state
  if (!run) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 bg-black">
        No run started
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="border-b border-gray-800 p-4">
        <Header run={run} time={time} />
      </div>

      {/* LOG TERMINAL */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        
        <LogView logs={logs} />
      </div>

      {/* FINAL OUTPUT */}
      <div className="border-t border-gray-800 p-4 bg-[#0f0f0f]">
        <Output output={output} />
      </div>

    </div>
  );
}

export default App;



const getColor = (status) => {
  switch (status) {
    case "running":
      return "text-blue-400";
    case "complete":
      return "text-green-400";
    case "failed":
      return "text-red-400";
    case "cancelled":
      return "text-yellow-400";
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
    <div className="space-y-1">

      {/* LIVE INDICATOR */}
      <div className="text-green-400 text-xs mb-2">
        ● live execution logs
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className="flex gap-3 text-xs leading-relaxed"
        >
          {/* TIME */}
          <span className="text-gray-500 w-20 shrink-0">
            {log.time}
          </span>

          {/* STATUS */}
          <span className={`${getColor(log.status)} w-24 shrink-0`}>
            <br />
            [{log.status}]
          </span>

          {/* MESSAGE */}
          <span className="text-gray-200 break-words">
            <h5>-----------------------------------</h5>
            {log.message}
          </span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};