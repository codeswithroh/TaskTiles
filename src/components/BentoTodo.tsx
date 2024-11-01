import React, { useState, useEffect } from "react";
import { Plus, RotateCcw } from "lucide-react";

type TaskSize = "small" | "medium" | "large";

interface Task {
  text: string;
  completed: boolean;
}

interface Tasks {
  [key: string]: Task;
}

const BentoTodo = () => {
  const [tasks, setTasks] = useState<Tasks>({
    small: { text: "", completed: false },
    medium: { text: "", completed: false },
    large: { text: "", completed: false },
  });

  const [editingTask, setEditingTask] = useState<TaskSize | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("bentoTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bentoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleStartEdit = (size: TaskSize, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(size);
    setInputValue(tasks[size].text);
  };

  const handleSaveTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTask && inputValue.trim()) {
      setTasks((prev) => ({
        ...prev,
        [editingTask]: { text: inputValue.trim(), completed: false },
      }));
      setEditingTask(null);
      setInputValue("");
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(null);
    setInputValue("");
  };

  const toggleComplete = (size: TaskSize) => {
    setTasks((prev) => ({
      ...prev,
      [size]: { ...prev[size], completed: !prev[size].completed },
    }));
  };

  const getBoxSize = (size: TaskSize) => {
    const baseClasses = "rounded-xl transition-all duration-300";
    switch (size) {
      case "small":
        return `${baseClasses} h-40 md:h-48`;
      case "medium":
        return `${baseClasses} h-64 md:h-80`;
      case "large":
        return `${baseClasses} h-96 md:h-[480px]`;
      default:
        return baseClasses;
    }
  };

  const getBackgroundColorClass = (size: TaskSize, completed: boolean) => {
    const colorClasses = {
      small: "bg-[#F4A261]",
      medium: "bg-[#e9c46a]",
      large: "bg-[#94d1ee]",
    };

    return `${colorClasses[size]} ${completed ? "opacity-70" : "opacity-100"}`;
  };

  const renderTask = (size: TaskSize) => {
    const task = tasks[size];
    const isEditing = editingTask === size;

    return (
      <div
        className={`${getBoxSize(size)} ${getBackgroundColorClass(
          size,
          task.completed
        )} 
          p-6 relative hover:shadow-lg cursor-pointer w-full 
          transition-transform duration-300 hover:scale-[1.02] flex flex-col`}
        onClick={() => task.text && toggleComplete(size)}
      >
        {isEditing ? (
          <div
            className="flex flex-col h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              className="w-full h-full p-4 rounded bg-white/90 resize-none text-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Add ${size} task...`}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSaveTask}
                className="px-4 py-2 bg-[#2A9D8F] rounded text-white hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-red-500 rounded text-white hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {task.text ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700 bg-white/30 px-3 py-1 rounded">
                    {size}
                  </span>
                  <button
                    className="text-sm font-medium text-gray-700 bg-white/30 px-3 py-1 rounded hover:bg-white/40"
                    onClick={(e) => handleStartEdit(size, e)}
                  >
                    Edit
                  </button>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  <span
                    className={`text-xl md:text-2xl text-gray-800 text-center
                    ${task.completed ? "line-through" : ""}`}
                  >
                    {task.text}
                  </span>
                </div>
                {task.completed && (
                  <div className="absolute bottom-6 right-6 text-gray-700 bg-white/30 px-3 py-1 rounded">
                    Completed
                  </div>
                )}
              </div>
            ) : (
              <div
                className="h-full flex flex-col items-center justify-center gap-4"
                onClick={(e) => handleStartEdit(size, e)}
              >
                <Plus className="w-8 h-8 text-gray-600" />
                <span className="text-gray-600">Add {size} task</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">TaskTiles</h1>
            <p className="text-gray-600 mt-2">
              Organize your day with small, medium, and large priorities
            </p>
          </div>
          {Object.values(tasks).every(
            (task) => task.completed && task.text !== ""
          ) && (
            <button
              onClick={() => {
                setTasks({
                  small: { text: "", completed: false },
                  medium: { text: "", completed: false },
                  large: { text: "", completed: false },
                });
              }}
              className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <RotateCcw /> Reset Tasks
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderTask("small")}
          {renderTask("medium")}
          {renderTask("large")}
        </div>
      </div>
    </div>
  );
};

export default BentoTodo;
