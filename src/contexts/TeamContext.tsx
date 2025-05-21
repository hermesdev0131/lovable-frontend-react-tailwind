import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '@/config';
import { toast } from '@/hooks/use-toast';

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
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);

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
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTeam(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <TeamContext.Provider value={{
      teamMembers,
      isLoadingTeam,
      teamLoaded,
      fetchTeamMembers
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