import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Mail, MessageCircle, Phone, Send, ExternalLink, Flag, Loader2, CalendarIcon, Clock } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { config } from '@/config';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface TaskFormValues {
  title: string;
  date: string;
  priority?: 'low' | 'medium' | 'high';
  type?: Task['type'];
}

interface TasksPanelProps {
  onCreateTask?: (data: TaskFormValues) => void;
}

const getTaskIcon = (type: Task['type']) => {
  switch (type) {
    case 'EMAIL':
      return <Mail className="h-4 w-4" />;
    case 'CALL':
      return <Phone className="h-4 w-4" />;
    case 'TODO':
      return <Send className="h-4 w-4" />;
    default:
      return <Plus className="h-4 w-4" />;
  }
};

const getTaskColor = (type: Task['type']) => {
  switch (type) {
    case 'EMAIL':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    // case 'chat':
    //   return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'CALL':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    // case 'social':
    //   return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    case 'TODO':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const TasksPanel: React.FC<TasksPanelProps> = ({ onCreateTask }) => {
  const { tasks, addTask, updateTask, deleteTask, setPriority, isLoading } = useTasks();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState<string>("");
  const [editDueTime, setEditDueTime] = useState<string>("");
  const [editPriority, setEditPriority] = useState<Task['priority']>("medium");
  const [editStatus, setEditStatus] = useState<Task['completed']>(false);
  const [editAssignedTo, setEditAssignedTo] = useState<string>("");
  const { toast } = useToast();
  
  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      date: format(new Date(), 'MM/dd/yyyy'),
      priority: undefined,
      type: 'TODO'
    },
  });

  // Reset form with current date when dialog opens
  useEffect(() => {
    if (open) {
      taskForm.reset({
        title: '',
        date: format(new Date(), 'MM/dd/yyyy'),
        priority: undefined,
        type: 'TODO'
      });
    }
  }, [open, taskForm]);

  // Filter tasks to only show TODO type tasks
  const filteredTasks = tasks
    .filter(task => task.type === 'TODO')
    .filter(task => {
      if (activeTab === 'active') return !task.completed;
      if (activeTab === 'completed') return task.completed;
      return true;
    });

  const sortedTasks = sortTasksByPriority(filteredTasks);

  const handleSubmit = async (data: TaskFormValues) => {
    if (!data.title?.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setIsAddingTask(true);
    
    const now = new Date().toISOString();
    const newTask = {
      ...data,
      type: 'TODO', // Force type to be TODO for tasks panel
      completed: false,
      createdAt: now,
      updatedAt: now
    };
    
    try {
      // Send task data to backend API
      const response = await fetch(`${config.apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add task');
      }
      
      const savedTask = await response.json();
      
      // Add to local context with the ID from the API response
      addTask({
        ...savedTask,
        id: savedTask.id || savedTask.hubspotId,
      });
      
      toast({
        title: "Task Created",
        description: `${data.title} has been created successfully`
      });
      
      if (onCreateTask) {
        onCreateTask(data);
      }
      
      // Reset form with current date
      taskForm.reset({
        title: '',
        date: format(new Date(), 'MM/dd/yyyy'),
        priority: undefined,
        type: 'TODO'
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      
      // Generate a temporary ID for local state
      const tempId = `temp-${Date.now()}`;
      
      // Add to local context with a temporary ID
      addTask({
        ...newTask,
        id: tempId,
      } as Task);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task. It was saved locally.",
        variant: "destructive"
      });
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTaskCompletion = async (id: string, currentStatus: boolean) => {
    setUpdatingTaskId(id);
    
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = {
        ...task,
        completed: !currentStatus,
        updatedAt: new Date().toISOString(),
        hubspotId: task.hubspotId || task.id // Ensure we have the HubSpot ID
      };
      
      // Send update to backend API
      const response = await fetch(`${config.apiUrl}/tasks?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      
      // Update in context
      updateTask(id, { completed: !currentStatus });
      
      toast({
        title: "Task Updated",
        description: `Task has been marked as ${!currentStatus ? 'completed' : 'incomplete'}`
      });
    } catch (error) {
      console.error('Error updating task:', error);
      
      // Still update local context even if API call fails
      updateTask(id, { completed: !currentStatus });
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task. It was updated locally.",
        variant: "destructive"
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };
  
  const handleSetPriority = async (id: string, priority: Task['priority']) => {
    setUpdatingTaskId(id);
    
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = {
        ...task,
        priority,
        updatedAt: new Date().toISOString()
      };
      
      // Send update to backend API
      const response = await fetch(`${config.apiUrl}/tasks?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task priority');
      }
      
      // Update in context
      setPriority(id, priority);
      
      toast({
        title: "Priority Updated",
        description: `Task priority has been set to ${priority}`
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
      
      // Still update local context even if API call fails
      setPriority(id, priority);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update task priority. It was updated locally.",
        variant: "destructive"
      });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setDeletingTaskId(id);
    
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      // Send delete request to backend API with task data
      const response = await fetch(`${config.apiUrl}/tasks?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hubspotId: task.hubspotId || id,
          ...task
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }
      
      // Delete from context
      deleteTask(id);
      
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      
      // Still delete from local context even if API call fails
      deleteTask(id);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task. It was deleted locally.",
        variant: "destructive"
      });
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Helper function to safely parse dates
  const safeParseDate = (dateStr: string | undefined): Date | undefined => {
    if (!dateStr || typeof dateStr !== 'string') return undefined;
    try {
      const parsed = parse(dateStr, 'MM/dd/yyyy', new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  };

  // Helper function to safely format dates
  const safeFormatDate = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) return '';
    try {
      return format(date, 'MM/dd/yyyy');
    } catch {
      return '';
    }
  };

  // Helper function to ensure string value
  const ensureStringValue = (value: string | number): string => {
    return typeof value === 'string' ? value : String(value);
  };

  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" disabled={isAddingTask}>
              {isAddingTask ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                safeFormatDate(safeParseDate(field.value))
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={safeParseDate(field.value)}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(safeFormatDate(date));
                                setIsDatePickerOpen(false);
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Button 
                      variant="outline" 
                      type="button"
                      disabled={isAddingTask}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isAddingTask}>
                    {isAddingTask ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Task'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'active' | 'completed')}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px] pr-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading tasks...</p>
                </div>
              </div>
            ) : sortedTasks.length > 0 ? (
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
                      disabled={updatingTaskId === task.id}
                    >
                      {updatingTaskId === task.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : task.completed ? (
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatTaskDate(task.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {!task.completed && !task.priority && (
                        <Select 
                          onValueChange={(value) => handleSetPriority(task.id, value as Task['priority'])}
                          disabled={updatingTaskId === task.id}
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
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deletingTaskId === task.id}
                      >
                        {deletingTaskId === task.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
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
