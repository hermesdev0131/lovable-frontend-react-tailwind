
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Users } from 'lucide-react';
import { Project } from '@/contexts/ProjectsContext';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{project.client}</p>
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
        <div className="space-y-4">
          {project.description && (
            <p className="text-sm line-clamp-2">{project.description}</p>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Due: {new Date(project.dueDate).toLocaleDateString()}
            </span>
            <span>{project.progress}% Complete</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full", 
                project.status === 'completed' 
                  ? "bg-green-500" 
                  : "bg-blue-500"
              )}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          
          {project.members && project.members.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{project.members.length} team member{project.members.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
