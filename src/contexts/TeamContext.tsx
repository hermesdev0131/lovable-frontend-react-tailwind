import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '@/config';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  avatar?: string;
  updatedAt?: string;
}

interface TeamContextType {
  teamMembers: TeamMember[];
  isLoadingTeam: boolean;
  teamLoaded: boolean;
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'updatedAt'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  clearAllTeamMembers: () => void;
}

const STORAGE_KEY = 'crm_team_members';

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);

  // Load team members from localStorage on mount
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem(STORAGE_KEY);
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        if (Array.isArray(parsedMembers)) {
          setTeamMembers(parsedMembers);
          setTeamLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error loading team members from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever team members change
  useEffect(() => {
    if (teamLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamMembers));
    }
  }, [teamMembers, teamLoaded]);

  const fetchTeamMembers = async () => {
    if (isLoadingTeam) return;
    
    setIsLoadingTeam(true);
    try {
      const response = await fetch(`${config.apiUrl}/settings/teammembers`);
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      const data = await response.json();
      setTeamMembers(data);
      setTeamLoaded(true);
      
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error loading team members:', error);
      
      // Fallback to localStorage if API fails
      const savedMembers = localStorage.getItem(STORAGE_KEY);
      if (savedMembers) {
        setTeamMembers(JSON.parse(savedMembers));
      }
      
      toast({
        title: "Error",
        description: "Failed to load team members.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMember: TeamMember = {
      ...memberData,
      id: uuidv4(),
      updatedAt: now
    };

    try {
      const response = await fetch(`${config.apiUrl}/settings/teammembers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }

      const savedMember = await response.json();
      setTeamMembers(prev => [...prev, savedMember]);
      
      toast({
        title: "Success",
        description: "Team member added successfully."
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      
      // Still add to local state even if API call fails
      setTeamMembers(prev => [...prev, newMember]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add team member. It was saved locally.",
        variant: "destructive"
      });
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const response = await fetch(`${config.apiUrl}/settings/teammembers?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update team member');
      }

      const updatedMember = await response.json();
      setTeamMembers(prev => 
        prev.map(member => member.id === id ? { ...member, ...updatedMember } : member)
      );
      
      toast({
        title: "Success",
        description: "Team member updated successfully."
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      
      // Still update local state even if API call fails
      setTeamMembers(prev => 
        prev.map(member => member.id === id ? { ...member, ...updates } : member)
      );
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update team member. It was updated locally.",
        variant: "destructive"
      });
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      const response = await fetch(`${config.apiUrl}/settings/teammembers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }

      setTeamMembers(prev => prev.filter(member => member.id !== id));
      
      toast({
        title: "Success",
        description: "Team member removed successfully."
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      
      // Still remove from local state even if API call fails
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove team member. It was removed locally.",
        variant: "destructive"
      });
    }
  };

  const clearAllTeamMembers = () => {
    // Reset all state
    setTeamMembers([]);
    setTeamLoaded(false);
    setIsLoadingTeam(false);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // console.log("Team members state and storage cleared completely");
  };

  return (
    <TeamContext.Provider value={{
      teamMembers,
      isLoadingTeam,
      teamLoaded,
      fetchTeamMembers,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      clearAllTeamMembers
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}; 