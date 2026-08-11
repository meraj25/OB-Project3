import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Field, FieldGroup } from "./ui/field"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useCreateProjectMutation, useGetAllWorkspaceMembersQuery } from "@/lib/api"
import React, { useState, useMemo } from "react"

const ALLOWED_ROLE_IDS = [1, 2]; 

function CreateProjectForm({ user, workspaceId }) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: workspaceMembers = [] } = useGetAllWorkspaceMembersQuery();

  const [form, setForm] = useState({ project_name: "" });
  const [errors, setErrors] = useState({ project_name: "" });
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");


  const myMembership = useMemo(
    () =>
      workspaceMembers.find(
        (m) => m.user_id === user?.user_id && m.workspace_id === workspaceId
      ),
    [workspaceMembers, user?.user_id, workspaceId]
  );

  const canCreateProject = ALLOWED_ROLE_IDS.includes(myMembership?.role_id);

  const validateProject = () => {
    const validationErrors = { project_name: "" };
    if (!form.project_name.trim()) {
      validationErrors.project_name = "Project name is required.";
    }
    setErrors(validationErrors);
    return !validationErrors.project_name;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
console.log(myMembership, canCreateProject)
    if (!canCreateProject) {
      setSubmitError("You don't have permission to create projects in this workspace.");
      return;
    }
    if (!validateProject()) return;

    try {
      await createProject({ workspaceId, project: form }).unwrap();
      setForm({ project_name: "" });
      setOpen(false);
    } catch {
      setSubmitError("Couldn't create the project. Please try again.");
    }
  };

  if (!canCreateProject) {
    return null; 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline">Create Project</Button>} />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Project</DialogTitle>
            <DialogDescription>
              Add a new project to this workspace.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                name="project_name"
                value={form.project_name}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.project_name && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.project_name}
                </p>
              )}
            </Field>
          </FieldGroup>

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectForm;