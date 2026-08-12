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
import { useCreateWorkspaceMutation } from "@/lib/api"
import React, { useState, useEffect } from "react"


function CreateWorkspaceForm({ user }) {

  console.log(user, "user")
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const [form, setForm] = useState({ workspace_name: ""});
  const [errors, setErrors] = useState({ workspace_name: "" });
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateWorkspace = () => {
    const validationErrors = { workspace_name: "" };
    if (!form.workspace_name.trim()) {
      validationErrors.workspace_name = "Workspace name is required.";
    }
    setErrors(validationErrors);
    return !validationErrors.workspace_name;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSubmitError("");

    if (!validateWorkspace()) return;



    try {

      const workspace = {workspace_name: form.workspace_name}
      await createWorkspace(workspace).unwrap();
      setForm({ workspace_name: ""}); 
      setOpen(false); 
    } catch (err) {
      setSubmitError("Couldn't create the workspace. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
        <DialogTrigger render={<Button type="button" variant="outline">Create Workspace</Button>} />
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Workspace</DialogTitle>
            <DialogDescription>
              Make your own workspace. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="workspace_name">Workspace Name</Label>
              <Input
                id="workspace_name"
                name="workspace_name"
                value={form.workspace_name}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.workspace_name && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.workspace_name}
                </p>
              )}
            </Field>

            <Field>
              <Label>Created By</Label>
              <p className="text-sm text-muted-foreground">{user?.user_name ?? "You"}</p>
            </Field>
          </FieldGroup>

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      
    </Dialog>
  );
}

export default CreateWorkspaceForm;