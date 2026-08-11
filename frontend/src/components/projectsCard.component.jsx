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
import { Button } from "./ui/button";
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
import { useNavigate } from "react-router";
import {
  useGetAllWorkspaceMembersQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation

} from "@/lib/api";

const ALLOWED_ROLE_IDS = [1, 2];

export function ProjectCard({ project, user, workspaceId }) {
  const navigate = useNavigate();
  const { data: workspaceMembers = [] } = useGetAllWorkspaceMembersQuery();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const { project_id, project_name, created_at, updated_at, issues } = project;

  const myMembership = workspaceMembers.find(
    (m) => m.user_id === user?.user_id && m.workspace_id === workspaceId
  );
  const canManageProject = ALLOWED_ROLE_IDS.includes(myMembership?.role_id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(project_name);
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const formattedCreatedDate = new Date(created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedUpdatedDate = new Date(updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const issueCount = Array.isArray(issues) ? issues.length : null;

  const handleViewClick = () => {
    navigate(`/workspaces/${workspaceId}/projects/${project_id}/issues`);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editName.trim()) {
      setEditError("Project name is required.");
      return;
    }

    try {
      await updateProject({ workspaceId, projectId: project_id, project_name: editName }).unwrap();
      setIsEditOpen(false);
    } catch {
      setEditError("Couldn't save changes. Please try again.");
    }
  };

  const handleDeleteClick = async () => {
    setDeleteError("");
    try {
      await deleteProject({ workspaceId, projectId: project_id }).unwrap();
    } catch {
      setDeleteError("Couldn't delete the project. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project_name}</CardTitle>
        <CardDescription>Created {formattedCreatedDate}</CardDescription>
        <CardAction>
          <span className="text-xs text-muted-foreground">#{project_id}</span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {issueCount === null
            ? "Issue count unavailable"
            : `${issueCount} ${issueCount === 1 ? "issue" : "issues"}`}
        </p>
        <p className="text-xs text-muted-foreground">Last updated {formattedUpdatedDate}</p>
        {deleteError && (
          <p role="alert" className="text-sm text-destructive">{deleteError}</p>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        {canManageProject && (
          <>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger render={<Button type="button" variant="outline" className="text-sm">Edit</Button>} />
              <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleEditSubmit}>
                  <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>Update the project name.</DialogDescription>
                  </DialogHeader>

                  <FieldGroup>
                    <Field>
                      <Label htmlFor={`edit-project-name-${project_id}`}>Project Name</Label>
                      <Input
                        id={`edit-project-name-${project_id}`}
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
          View
        </Button>
      </CardFooter>
    </Card>
  );
}