
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  dueDate: string;
  progress: number;
  description?: string;
  members?: string[];
  tasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  createdAt: string;
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProjectById: (id: number) => Project | undefined;
}

const STORAGE_KEY = 'crm_projects';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    return savedProjects ? JSON.parse(savedProjects) : [
      {
        id: 1,
        name: 'Website Redesign',
        client: 'Acme Corp',
        status: 'active',
        dueDate: '2025-06-30',
        progress: 65,
        description: 'Complete redesign of client website with new branding',
        members: ['John Doe', 'Jane Smith'],
        createdAt: '2025-03-01'
      },
      {
        id: 2,
        name: 'SEO Campaign',
        client: 'Tech Solutions',
        status: 'active',
        dueDate: '2025-05-15',
        progress: 30,
        description: 'Improve search engine ranking for key terms',
        members: ['Jane Smith', 'Bob Johnson'],
        createdAt: '2025-03-15'
      },
      {
        id: 3,
        name: 'Social Media Strategy',
        client: 'Retail Partners',
        status: 'completed',
        dueDate: '2025-02-28',
        progress: 100,
        description: 'Develop and implement social media strategy across platforms',
        members: ['John Doe', 'Alice Williams'],
        createdAt: '2025-02-01'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: newId,
      createdAt: now
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => project.id === id ? { ...project, ...updates } : project)
    );
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };
  
  const getProjectById = (id: number) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
