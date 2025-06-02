import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Shield, UserCog, Trash2, Check, X, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTeam, TeamMember } from "@/contexts/TeamContext";

const TeamMembers = () => {
  const { 
    teamMembers, 
    isLoadingTeam, 
    addTeamMember, 
    updateTeamMember, 
    removeTeamMember 
  } = useTeam();

  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    status: "active" | "pending" | "inactive"
  }>({
    name: "",
    email: "",
    role: "editor",
    status: "pending"
  });

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const handleAddMember = async() => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the new team member.",
        variant: "destructive"
      });
      return;
    }

    // Trim email to remove any whitespace
    const trimmedEmail = newMember.email.trim();
    
    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address (e.g., user@domain.com).",
        variant: "destructive"
      });
      return;
    }

    if (teamMembers.some(member => member.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      toast({
        title: "Duplicate email",
        description: "A team member with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingMember(true);
    try {
      await addTeamMember({
        ...newMember,
        email: trimmedEmail
      });

      // Reset the input fields after adding
      setNewMember({ name: "", email: "", role: "editor", status: "pending"});
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: "admin" | "editor" | "viewer") => {
    try {
      await updateTeamMember(memberId, { role: newRole });
    } catch (error) {
      console.error('Error updating team member role:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setDeletingMemberId(memberId);
    try {
      await removeTeamMember(memberId);
    } catch (error) {
      console.error('Error removing team member:', error);
    } finally {
      setDeletingMemberId(null);
    }
  };

  const handleResendInvite = (email: string) => {
    toast({
      title: "Invitation resent",
      description: `A new invitation has been sent to ${email}`
    });
  };

  const validateEmail = (email: string) => {
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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

  const openInviteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    const roleText = getRoleDescription(member.role);
    setInviteMessage(
      `Hello ${member.name},\n\nYou have been invited to join our portal as a ${roleText}. Please click the link below to create your account and get started.\n\nThank you!`
    );
    setShowInviteDialog(true);
  };

  const getRoleDescription = (role: string) => {
    switch(role) {
      case "admin":
        return "administrator (can make changes like delete items)";
      case "editor":
        return "editor (able to input things and view all content, and only delete items they added)";
      case "viewer":
        return "viewer (can only view content, not input or delete)";
      default:
        return role;
    }
  };

  const handleInvitationEmail = async (email: string) => {
    try {
      // Implement your own email sending logic here
      // console.log(`Sending invitation email to ${email}`);
      // Add your email sending implementation
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      throw new Error('Failed to send invitation email');
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
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTeam ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2">Loading team members...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No team members added yet. Add your first team member below.
                    </TableCell>
                  </TableRow>
                ) : ( 
                  teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                      </TableCell>
                      <TableCell>
                         <div className="font-medium">{member.name}</div>
                      </TableCell>
                      <TableCell>
                         <div className="text-sm text-muted-foreground">{member.email}</div>
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
                            <SelectItem value="viewer">
                              Viewer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell>
                        {renderStatusBadge(member.status)}
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
                            disabled={deletingMemberId === member.id}
                          >
                            {deletingMemberId === member.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                  <SelectItem value="viewer">
                    Viewer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddMember} disabled={isAddingMember}>
          {isAddingMember ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </>
          )}
        </Button>
      </CardFooter>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Invitation Email</DialogTitle>
            <DialogDescription>
              Customize the invitation message for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">
                Recipient
              </Label>
              <Input
                id="invite-email"
                value={selectedMember?.email || ''}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="invite-message" className="text-right mt-2">
                Message
              </Label>
              <div className="col-span-3">
                <textarea
                  id="invite-message"
                  rows={6}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This message will be included in the invitation email.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowInviteDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleInvitationEmail(selectedMember?.email || '')}
              disabled={isSending}
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TeamMembers;
