import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Shield, UserCog, Trash2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  avatar?: string;
  lastActive?: string;
}

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      lastActive: "Today at 2:34 PM"
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "editor",
      status: "active",
      lastActive: "Yesterday at 5:12 PM"
    },
    {
      id: "3",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "viewer",
      status: "pending",
    }
  ]);

  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
  }>({
    name: "",
    email: "",
    role: "editor"
  });

  const [inviteMode, setInviteMode] = useState(true);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the new team member.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(newMember.email)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (teamMembers.some(member => member.email.toLowerCase() === newMember.email.toLowerCase())) {
      toast({
        title: "Duplicate email",
        description: "A team member with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    const newTeamMember: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: "pending"
    };

    setTeamMembers([...teamMembers, newTeamMember]);
    setNewMember({ name: "", email: "", role: "editor" });

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMember.email}`,
    });
  };

  const handleRoleChange = (memberId: string, newRole: "admin" | "editor" | "viewer") => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole } 
          : member
      )
    );
    
    toast({
      title: "Role updated",
      description: "Team member role has been updated successfully."
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    
    toast({
      title: "Team member removed",
      description: "The team member has been removed successfully."
    });
  };

  const handleResendInvite = (email: string) => {
    toast({
      title: "Invitation resent",
      description: `A new invitation has been sent to ${email}`
    });
  };

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 mr-1" />;
      case "editor":
        return <UserCog className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="h-3 w-3 mr-1" /> Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100"><X className="h-3 w-3 mr-1" /> Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Manage your team members and their access permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Team</h3>
            <div className="flex gap-2 items-center">
              <Label htmlFor="invite-mode" className="text-sm">Send invite emails</Label>
              <Switch 
                id="invite-mode" 
                checked={inviteMode} 
                onCheckedChange={setInviteMode} 
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value as "admin" | "editor" | "viewer")}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="editor">
                            <div className="flex items-center">
                              <UserCog className="h-4 w-4 mr-2" />
                              Editor
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(member.status)}
                      {member.lastActive && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Last active: {member.lastActive}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {member.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResendInvite(member.email)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Resend
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Add Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="member-name">Name</Label>
              <Input 
                id="member-name" 
                placeholder="John Doe"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="member-email">Email</Label>
              <Input 
                id="member-email" 
                type="email"
                placeholder="john@example.com"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="member-role">Role</Label>
              <Select 
                value={newMember.role}
                onValueChange={(value: "admin" | "editor" | "viewer") => setNewMember({...newMember, role: value})}
              >
                <SelectTrigger id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center">
                      <UserCog className="h-4 w-4 mr-2" />
                      Editor
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddMember}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMembers;
