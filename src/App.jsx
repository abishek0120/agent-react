import { useEffect, useState, useRef } from "react";
import { runEmitter } from "./files/emitter";
import events from "./files/success.json";

import Header from "./components/Header";
import Tasklist from "./components/Tasklist";
import Output from "./components/output";
import Thoughts from "./components/thoughts";
// import Emptystate from "./components/emptystate";

function App() {
  const [run, setRun] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState(null);
  const [time, setTime] = useState(0);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    runEmitter(events, handleEvent);
  }, []);

  // ⏱ TIMER
  useEffect(() => {
    if (!run || run.status !== "running") return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [run]);

  const Emptystate = () => {
  return (
    <div className="h-screen flex items-center justify-center text-gray-500">
      No run started
    </div>
  );
};

  const handleEvent = (event) => {
    switch (event.type) {
      case "run_started":
        setRun({ query: event.query, status: "running" });
        break;

      case "agent_thought":
        setThought(event.thought);
        break;

      case "task_spawned":
        setTasks((prev) => [
          ...prev,
          {
            id: event.task_id,
            label: event.label,
            agent: event.agent,
            status: "pending",
            outputs: [],
            parallel_group: event.parallel_group || null,
            depends_on: event.depends_on || []
          }
        ]);
        break;

      case "task_update":
        setTasks((prev) =>
          prev.map((t) =>
            t.id === event.task_id
              ? {
                  ...t,
                  status: event.status,
                  error: event.error || null,
                  reason: event.reason || null
                }
              : t
          )
        );
        break;

      case "partial_output":
        setTasks((prev) =>
          prev.map((t) =>
            t.id === event.task_id
              ? {
                  ...t,
                  outputs: event.is_final
                    ? [event.content]
                    : t.outputs.includes(event.content)
                    ? t.outputs
                    : [...t.outputs, event.content]
                }
              : t
          )
        );
        break;

      case "run_complete":
        setRun((prev) => ({ ...prev, status: "complete" }));
        setOutput(event.output.summary);
        break;

      default:
        break;
    }
  };

  if (!run) return <Emptystate />;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* HEADER */}
      <div className="border-b border-slate-700 p-4">
        <Header run={run} time={time} />
      </div>

      {/* THOUGHT */}
      {thought && (
        <div className="border-b border-slate-700 p-3">
          <Thoughts thought={thought} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TASK SECTION */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-400 mb-2">Task Execution</p>
          <Tasklist tasks={tasks} />
        </div>

        {/* OUTPUT */}
        <div className="border-t border-slate-700 p-4 bg-slate-800">
          <Output output={output} />
        </div>

      </div>
    </div>
  );
}

export default App;