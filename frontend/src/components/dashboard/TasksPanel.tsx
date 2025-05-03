
import React, { useState } from 'react';
import { Plus, Check, X, Mail, MessageCircle, Phone, Send, ExternalLink, Flag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { useTasks, Task } from '@/contexts/TasksContext';
import { sortTasksByPriority, formatTaskDate, getTaskPriorityColor } from '@/utils/taskUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskFormValues {
  title: string;
  date: string;
  priority?: 'low' | 'medium' | 'high';
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
  const { tasks, addTask, updateTask, deleteTask, setPriority } = useTasks();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  
  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      priority: undefined
    },
  });

  const handleSubmit = (data: TaskFormValues) => {
    addTask({
      title: data.title,
      date: data.date,
      completed: false,
      type: 'manual',
      priority: data.priority
    });
    
    if (onCreateTask) {
      onCreateTask(data);
    }
    
    taskForm.reset({
      title: '',
      date: new Date().toISOString().split('T')[0],
      priority: undefined
    });
    
    setOpen(false);
  };

  const toggleTaskCompletion = (id: string, currentStatus: boolean) => {
    updateTask(id, { completed: !currentStatus });
  };
  
  const handleSetPriority = (id: string, priority: Task['priority']) => {
    setPriority(id, priority);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'active') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = sortTasksByPriority(filteredTasks);

  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
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
                <FormField
                  control={taskForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
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
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-medium truncate ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex gap-1 flex-wrap ml-auto">
                          {task.priority && (
                            <Badge className={getTaskPriorityColor(task.priority)}>
                              <Flag className="h-3 w-3 mr-1" />
                              {task.priority}
                            </Badge>
                          )}
                          <Badge className={`${getTaskColor(task.type)} flex-shrink-0`}>
                            <span className="flex items-center gap-1">
                              {getTaskIcon(task.type)}
                              <span className="hidden sm:inline capitalize text-xs">{task.type}</span>
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatTaskDate(task.date)}</span>
                        {task.source && (
                          <span className="text-xs opacity-70">via {task.source}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {!task.completed && !task.priority && (
                        <Select 
                          onValueChange={(value) => handleSetPriority(task.id, value as Task['priority'])}
                        >
                          <SelectTrigger className="h-7 w-7 p-0">
                            <Flag className="h-3.5 w-3.5" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">No {activeTab !== 'all' ? activeTab : ''} tasks</p>
                  <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Task
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
