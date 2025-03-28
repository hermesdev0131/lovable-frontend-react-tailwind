
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface TaskFormValues {
  title: string;
  date: string;
}

interface TasksPanelProps {
  onCreateTask: (data: TaskFormValues) => void;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ onCreateTask }) => {
  const navigate = useNavigate();
  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      date: '',
    },
  });

  return (
    <Card className="hover:shadow transition-all duration-300 ease-in-out bg-white text-black dark:bg-card dark:text-card-foreground">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground mb-4">
          <Dialog>
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
                <form onSubmit={taskForm.handleSubmit(onCreateTask)} className="space-y-4">
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
          
          <div className="flex items-center justify-center space-x-3 mt-2">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
          
          <p className="mt-4">No tasks scheduled</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
