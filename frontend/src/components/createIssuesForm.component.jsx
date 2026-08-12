import { useState } from "react";
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
import { useCreateIssueMutation, useGetAllUsersQuery } from "@/lib/api";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = ["To Check", "In Progress", "Resolved"];

function CreateIssueForm({
    user,
    workspaceId,
    projectId,
    parentIssueId = null,
    triggerLabel = "Create Issue",
    triggerVariant = "default",
}) {
   
    const [createIssue, { isLoading }] = useCreateIssueMutation();
    const { data: users = [] } = useGetAllUsersQuery();

    const [form, setForm] = useState({
        issue_name: "",
        issue_description: "",
        issue_priority: "Low", 
        issue_status: "To Check",
    });
    const [assigneeIds, setAssigneeIds] = useState([]);
    const [errors, setErrors] = useState({ issue_name: "" });
    const [open, setOpen] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const toggleAssignee = (userId) => {
        setAssigneeIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const validate = () => {
        const validationErrors = { issue_name: "" };
        if (!form.issue_name.trim()) {
            validationErrors.issue_name = "Issue name is required.";
        }
        setErrors(validationErrors);
        return !validationErrors.issue_name;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        if (!validate()) return;

        const payload = {
            ...form,
            issue_reporter: user?.user_id,
            parent_issue_id: parentIssueId,
            assignee_ids: assigneeIds, 
        };
        console.log(payload, "payload")

        try {
            
            const issue = await createIssue({ workspaceId, projectId, data: payload }).unwrap();
            console.log(issue,"created issue")
            setForm({ issue_name: "", issue_description: "", issue_priority: "Low", issue_status: "To Check" });
            setAssigneeIds([]);
            setOpen(false);
        } catch {
            setSubmitError("Couldn't create the issue. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button type="button" variant={triggerVariant}>{triggerLabel}</Button>} />
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{parentIssueId ? "Create Sub-issue" : "Create Issue"}</DialogTitle>
                        <DialogDescription>
                            {parentIssueId
                                ? `This will be linked as a sub-issue of #${parentIssueId}.`
                                : "Add a new issue to this project."}
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="issue_name">Issue Name</Label>
                            <Input
                                id="issue_name"
                                name="issue_name"
                                value={form.issue_name}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.issue_name && (
                                <p role="alert" className="text-sm text-destructive">{errors.issue_name}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="issue_description">Description</Label>
                            <Input
                                id="issue_description"
                                name="issue_description"
                                value={form.issue_description}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="issue_priority">Priority</Label>
                            <select
                                id="issue_priority"
                                name="issue_priority"
                                value={form.issue_priority}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="border rounded-md px-2 py-1"
                            >
                                {PRIORITY_OPTIONS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </Field>

                        <Field>
                            <Label htmlFor="issue_status">Status</Label>
                            <select
                                id="issue_status"
                                name="issue_status"
                                value={form.issue_status}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="border rounded-md px-2 py-1"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </Field>

                        <Field>
                            <Label>Assignees</Label>
                            <div className="max-h-40 overflow-y-auto flex flex-col gap-1 border rounded-md p-2">
                                {users.map((u) => (
                                    <label key={u.user_id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={assigneeIds.includes(u.user_id)}
                                            onChange={() => toggleAssignee(u.user_id)}
                                            disabled={isLoading}
                                        />
                                        {u.user_name}
                                    </label>
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    {submitError && (
                        <p role="alert" className="text-sm text-destructive">{submitError}</p>
                    )}

                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating…" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateIssueForm;