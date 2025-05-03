
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Users, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  dueDate: string;
  progress: number;
}

const projects: Project[] = [];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <CardDescription>{project.client}</CardDescription>
          </div>
          <Badge 
            variant={
              project.status === 'active' ? 'default' : 
              project.status === 'completed' ? 'secondary' : 'outline'
            }
            className={cn(
              "capitalize",
              project.status === 'completed' && "bg-green-500 hover:bg-green-600"
            )}
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Due: {new Date(project.dueDate).toLocaleDateString()}
            </span>
            <span>{project.progress}% Complete</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Projects = () => {
  const [showEmptyState, setShowEmptyState] = useState(projects.length === 0);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      {showEmptyState ? (
        <Card className="w-full p-8 text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Projects Yet</CardTitle>
            <CardDescription className="mb-6">
              Create your first project to start tracking your work.
            </CardDescription>
            <Button onClick={() => setShowEmptyState(false)}>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
