import { useEffect, useState ,useRef} from "react";
import { runEmitter } from "./files/emitter";
import events from "./files/success.json";

import Header from "./components/Header";
import Tasklist from "./components/Tasklist";
import Output from "./components/output";
import Thoughts from "./components/thoughts";
import Emptystate from "./components/emptystate";

function App() {
  const [run, setRun] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState(null);
  const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return;  
  hasRun.current = true;
    runEmitter(events, handleEvent);
}, []);

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
      parallel_group: event.parallel_group,
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
            outputs: t.outputs.includes(event.content)
  ? t.outputs
  : [...t.outputs, event.content] // append if streaming
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
        <Header run={run} />
      </div>

      {/* THOUGHT */}
      {thought && (
        <div className="border-b border-slate-700 p-3">
          <Thoughts thought={thought} />
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TASKS */}
        <div className="flex-1 overflow-y-auto p-4">
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