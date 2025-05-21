import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { socialMediaService } from '@/services/socialMedia';
import { config } from '@/config';

export type Task = {
  id: string;
  hubspotId?: string;
  title: string;
  date: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  type: 'TODO' | 'CALL' | 'EMAIL';
  source?: string;
  createdAt: string;
  updatedAt: string;
};

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addActivityAsTask: (activity: { 
    title: string;
    type: Task['type'];
    source?: string;
    relatedTo?: string;
  }) => void;
  clearCompletedTasks: () => void;
  setPriority: (id: string, priority: Task['priority']) => void;
  filterTasks: (filters: { status?: 'all' | 'completed' | 'active', type?: Task['type'] }) => Task[];
  isLoading: boolean;
  tasksLoaded: boolean;
  fetchTasks: () => Promise<void>;
}

const STORAGE_KEY = 'crm_tasks';

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  const fetchTasks = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${config.apiUrl}/tasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
      setTasksLoaded(true);
      
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
      
      // Fallback to localStorage if API fails
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasksLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, tasksLoaded]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => task.id === id ? { ...task, ...updates } : task)
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addActivityAsTask = (activity: { 
    title: string;
    type: Task['type'];
    source?: string;
    relatedTo?: string;
  }) => {
    const now = new Date().toISOString();
    addTask({
      title: activity.title,
      date: now.split('T')[0],
      completed: true,
      type: activity.type,
      source: activity.source,
      updatedAt: now
    });
  };
  
  // Set priority for a task
  const setPriority = (id: string, priority: Task['priority']) => {
    updateTask(id, { priority });
  };
  
  // Filter tasks based on provided filters
  const filterTasks = (filters: { status?: 'all' | 'completed' | 'active', type?: Task['type'] }) => {
    return tasks.filter(task => {
      // Filter by status
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'active' && task.completed) return false;
      
      // Filter by type
      if (filters.type && task.type !== filters.type) return false;
      
      return true;
    });
  };
  
  // Clear completed tasks
  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        addActivityAsTask,
        clearCompletedTasks,
        setPriority,
        filterTasks,
        isLoading,
        tasksLoaded,
        fetchTasks
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
