
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Users, Clock, CheckCircle, Search, CalendarIcon, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProjects, Project } from '@/contexts/ProjectsContext';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectForm from '@/components/projects/ProjectForm';
import { cn } from '@/lib/utils';

const Projects = () => {
  const { projects, addProject } = useProjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<'grid' | 'list'>('grid');
  
  // Filter projects based on search term and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    addProject(projectData);
    setIsCreateDialogOpen(false);
    toast({
      title: "Project created",
      description: `${projectData.name} has been created successfully.`
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Enter the details for your new project.
              </DialogDescription>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreateProject} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || statusFilter !== 'all') && (
            <Button variant="ghost" size="icon" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'grid' | 'list')} className="w-auto">
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-1">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 3H12.5C12.7761 3 13 3.22386 13 3.5V6.5C13 6.77614 12.7761 7 12.5 7H8.5C8.22386 7 8 6.77614 8 6.5V3.5C8 3.22386 8.22386 3 8.5 3ZM8.5 8H12.5C12.7761 8 13 8.22386 13 8.5V11.5C13 11.7761 12.7761 12 12.5 12H8.5C8.22386 12 8 11.7761 8 11.5V8.5C8 8.22386 8.22386 8 8.5 8ZM2.5 3H6.5C6.77614 3 7 3.22386 7 3.5V6.5C7 6.77614 6.77614 7 6.5 7H2.5C2.22386 7 2 6.77614 2 6.5V3.5C2 3.22386 2.22386 3 2.5 3ZM2.5 8H6.5C6.77614 8 7 8.22386 7 8.5V11.5C7 11.7761 6.77614 12 6.5 12H2.5C2.22386 12 2 11.7761 2 11.5V8.5C2 8.22386 2.22386 8 2.5 8Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredProjects.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Projects Found</CardTitle>
            <CardDescription className="mb-6">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search filters."
                : "Create your first project to start tracking your work."}
            </CardDescription>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TabsContent value="grid" className={cn(currentTab === "grid" ? "block" : "hidden")}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="list" className={cn(currentTab === "list" ? "block" : "hidden")}>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-12 rounded-full",
                      project.status === 'active' ? "bg-blue-500" :
                      project.status === 'completed' ? "bg-green-500" : "bg-amber-500"
                    )} />
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full", 
                              project.status === 'completed' 
                                ? "bg-green-500" 
                                : "bg-blue-500"
                            )}
                            style={{ width: `${project.progress}%` }} 
                          />
                        </div>
                        <span className="text-xs">{project.progress}%</span>
                      </div>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default Projects;
