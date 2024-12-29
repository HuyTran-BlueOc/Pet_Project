import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskPublic } from "../client";

// Define types for context
interface SelectedTasksContextType {
  selectedTasks: TaskPublic[];
  toggleTaskSelection: (task: TaskPublic) => void;
  selectAllTasks: (tasks: TaskPublic[]) => void;
  clearSelectedTasks: () => void;
}

const SelectedTasksContext = createContext<SelectedTasksContextType | undefined>(
  undefined
);

// Provider component to wrap the app or relevant part
export const SelectedTasksProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTasks, setSelectedTasks] = useState<TaskPublic[]>([]);

  const toggleTaskSelection = (task: TaskPublic) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t.id !== task.id) : [...prev, task]
    );
  };

  const selectAllTasks = (tasks: TaskPublic[]) => {
    setSelectedTasks(tasks);
  };

  const clearSelectedTasks = () => {
    setSelectedTasks([]);
  };

  return (
    <SelectedTasksContext.Provider
      value={{ selectedTasks, toggleTaskSelection, selectAllTasks, clearSelectedTasks }}
    >
      {children}
    </SelectedTasksContext.Provider>
  );
};

// Custom hook to use the SelectedTasksContext
export const useSelectedTasks = () => {
  const context = useContext(SelectedTasksContext);
  if (!context) {
    throw new Error("useSelectedTasks must be used within a SelectedTasksProvider");
  }
  return context;
};
