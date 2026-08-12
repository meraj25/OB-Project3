import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  useGetAllUsersQuery,
  useGetAllWorkspaceMembersQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "@/lib/api";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

const OWNER_ROLE_ID = 1;

export function WorkspaceCard({ workspace, user }) {
  const navigate = useNavigate();
  const { data: users = [] } = useGetAllUsersQuery();
  const { data: workspaceMembers = [] } = useGetAllWorkspaceMembersQuery();
  const [updateWorkspace, { isLoading: isUpdating }] = useUpdateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();

  const { workspace_name, created_at, created_by, workspace_id } = workspace;

  const creator = users.find((u) => u.user_id === created_by);

  const myMembership = workspaceMembers.find(
    (m) => m.user_id === user?.user_id && m.workspace_id === workspace_id
  );
  const isCreator = created_by === user?.user_id;
  const isOwnerRole = myMembership?.role_id === OWNER_ROLE_ID;
  const canManageWorkspace = isCreator && isOwnerRole;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(workspace_name);
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const formattedDate = new Date(created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(created_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleViewClick = () => {
    navigate(`/workspaces/${workspace_id}/projects`);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editName.trim()) {
      setEditError("Workspace name is required.");
      return;
    }

    try {
      await updateWorkspace({ workspaceId: workspace_id, workspace_name: editName }).unwrap();
      setIsEditOpen(false);
    } catch {
      setEditError("Couldn't save changes. Please try again.");
    }
  };

  const handleDeleteClick = async () => {
    setDeleteError("");
    try {
      await deleteWorkspace({ workspaceId: workspace_id }).unwrap();
    } catch {
      setDeleteError("Couldn't delete the workspace. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workspace_name}</CardTitle>
        <CardDescription>
          Created by {creator?.user_name ?? "Unknown"} on {formattedDate} at {formattedTime}
        </CardDescription>
        <CardAction>
          <span className="text-xs text-muted-foreground">#{workspace_id}</span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {creator?.user_email ?? "No contact email on file"}
        </p>
        {deleteError && (
          <p role="alert" className="text-sm text-destructive">{deleteError}</p>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        {canManageWorkspace && (
          <>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger render={<Button type="button" variant="outline" className="text-sm">Edit</Button>} />
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleEditSubmit}>
                  <DialogHeader>
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>Update the workspace name.</DialogDescription>
                  </DialogHeader>

                  <FieldGroup>
                    <Field>
                      <Label htmlFor={`edit-workspace-name-${workspace_id}`}>Workspace Name</Label>
                      <Input
                        id={`edit-workspace-name-${workspace_id}`}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isUpdating}
                      />
                      {editError && (
                        <p role="alert" className="text-sm text-destructive">{editError}</p>
                      )}
                    </Field>
                  </FieldGroup>

                  <DialogFooter>
                    <DialogClose render={<Button type="button" variant="outline" disabled={isUpdating}>Cancel</Button>} />
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Saving…" : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              variant="destructive"
              className="text-sm"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </>
        )}

        <Button className="text-sm underline" onClick={handleViewClick}>
          View Projects
        </Button>
      </CardFooter>
    </Card>
  );
}