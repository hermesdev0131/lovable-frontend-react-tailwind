
import React from 'react';
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

const sampleProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    client: "Acme Corp",
    status: 'active',
    dueDate: "2023-12-15",
    progress: 65
  },
  {
    id: 2,
    name: "SEO Campaign",
    client: "Global Tech",
    status: 'active',
    dueDate: "2023-11-30",
    progress: 42
  },
  {
    id: 3,
    name: "Social Media Strategy",
    client: "Bright Future",
    status: 'on-hold',
    dueDate: "2023-12-20",
    progress: 18
  },
  {
    id: 4,
    name: "Content Calendar",
    client: "Sunshine Bakery",
    status: 'completed',
    dueDate: "2023-11-10",
    progress: 100
  }
];

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
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
