import React, { useState } from 'react';
import { Plus, Check, X, Mail, MessageCircle, Phone, Send, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { useTasks, Task } from '@/contexts/TasksContext';

interface TaskFormValues {
  title: string;
  date: string;
}

interface TasksPanelProps {
  onCreateTask?: (data: TaskFormValues) => void;
}

const getTaskIcon = (type: Task['type']) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'chat':
      return <MessageCircle className="h-4 w-4" />;
    case 'call':
      return <Phone className="h-4 w-4" />;
    case 'social':
      return <ExternalLink className="h-4 w-4" />;
    case 'text':
      return <Send className="h-4 w-4" />;
    default:
      return <Plus className="h-4 w-4" />;
  }
};

const getTaskColor = (type: Task['type']) => {
  switch (type) {
    case 'email':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'chat':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'call':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'social':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    case 'text':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const TasksPanel: React.FC<TasksPanelProps> = ({ onCreateTask }) => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [open, setOpen] = useState(false);
  
  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = (data: TaskFormValues) => {
    addTask({
      title: data.title,
      date: data.date,
      completed: false,
      type: 'manual'
    });
    
    if (onCreateTask) {
      onCreateTask(data);
    }
    
    taskForm.reset({
      title: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    setOpen(false);
  };

  const toggleTaskCompletion = (id: string, currentStatus: boolean) => {
    updateTask(id, { completed: !currentStatus });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <Form {...taskForm}>
                <form onSubmit={taskForm.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={taskForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={taskForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create Task</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <ScrollArea className="h-[300px] pr-3">
          {sortedTasks.length > 0 ? (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 border rounded-md flex items-center gap-3 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    {task.completed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2" />
                    )}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium truncate ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <Badge className={`${getTaskColor(task.type)} ml-auto flex-shrink-0`}>
                        <span className="flex items-center gap-1">
                          {getTaskIcon(task.type)}
                          <span className="hidden sm:inline capitalize">{task.type}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(task.date)}</span>
                      {task.source && (
                        <span className="text-xs opacity-70">via {task.source}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => deleteTask(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No tasks scheduled</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
