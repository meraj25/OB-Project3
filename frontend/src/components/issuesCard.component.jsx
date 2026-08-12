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
import CreateIssueForm from "./createIssuesForm.component";
import {
    useGetAllWorkspaceMembersQuery,
    useUpdateIssueMutation,
    useDeleteIssueMutation,
    useGetAllBlockedIssuesQuery,
    useGetBlockedIssueByIdQuery
} from "@/lib/api";

const DELETE_ALLOWED_ROLE_IDS = [1, 2];
const EDIT_ALLOWED_ROLE_IDS = [1, 2];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = ["To Check", "In Progress", "Resolved"];

export function IssueCard({ issue, subIssues = [], user, users, workspaceId, projectId, depth = 0 }) {
    const {
        issue_id,
        issue_name,
        issue_description,
        issue_reporter,
        issue_priority,
        issue_status,
        parent_issue_id,
        created_at,
        assignee, 
    } = issue;

    const [isExpanded, setIsExpanded] = useState(false);

    const { data: workspaceMembers = [] } = useGetAllWorkspaceMembersQuery();
    const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
    const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();

    const reporter = users.find((u) => u.user_id === issue_reporter);

    const myMembership = workspaceMembers.find(
        (m) => m.user_id === user?.user_id && m.workspace_id === workspaceId
    );

    const isAssignee = Array.isArray(assignee)
        ? assignee.some((a) => a.user_id === user?.user_id)
        : false;

    const canDelete = DELETE_ALLOWED_ROLE_IDS.includes(myMembership?.role_id);
    const canEdit =
        EDIT_ALLOWED_ROLE_IDS.includes(myMembership?.role_id) ||
        (myMembership?.role_id === 3 && isAssignee);

  
    const [statusValue, setStatusValue] = useState(issue_status);
    const [priorityValue, setPriorityValue] = useState(issue_priority);
    const [fieldError, setFieldError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        issue_name,
        issue_description: issue_description ?? "",
        issue_priority,
        issue_status
    });
    const [editError, setEditError] = useState("");

    const { data: blockedIssuesResponse } = useGetAllBlockedIssuesQuery({ workspaceId, projectId });
    const blockedIssuesList = Array.isArray(blockedIssuesResponse)
    ? blockedIssuesResponse
    : blockedIssuesResponse?.data ?? [];

    const blockingThisIssue = blockedIssuesList.filter((b) => b.blocked_issue_id === issue_id);
    const hasUnresolvedBlockers = blockingThisIssue.some(
     (b) => b.issues_block_issues_blocking_issue_idToissues?.issue_status !== "Resolved"
    );

    const formattedDate = new Date(created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const subIssueCountForWarning = subIssues.length;

    

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatusValue(newStatus);
        setFieldError("");
        try {
            await updateIssue({ workspaceId, projectId, issueId: issue_id, issue_status: newStatus }).unwrap();
        } catch {
            setStatusValue(issue_status);
            setFieldError("Couldn't update status.");
        }
    };

    const handlePriorityChange = async (e) => {
        const newPriority = e.target.value;
        setPriorityValue(newPriority);
        setFieldError("");
        try {
            await updateIssue({ workspaceId, projectId, issueId: issue_id, issue_priority: newPriority }).unwrap();
        } catch {
            setPriorityValue(issue_priority);
            setFieldError("Couldn't update priority.");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError("");

        if (!editForm.issue_name.trim()) {
            setEditError("Issue name is required.");
            return;
        }

        try {
            await updateIssue({
                workspaceId,
                projectId,
                issueId: issue_id,
                issue_name: editForm.issue_name,
                issue_description: editForm.issue_description,
                issue_priority:editForm.issue_priority,
                issue_status:editForm.issue_status
            }).unwrap();
            setIsEditOpen(false);
        } catch {
            setEditError("Couldn't save changes. Please try again.");
        }
    };

    const handleDeleteClick = async () => {
        setDeleteError("");
        try {
            await deleteIssue({ workspaceId, projectId, issueId: issue_id }).unwrap();
        } catch {
            setDeleteError("Couldn't delete the issue. Please try again.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{issue_name}</CardTitle>
                <CardDescription>
                    Reported by {reporter?.user_name ?? "Unknown"} on {formattedDate}
                </CardDescription>
                <CardAction>
                    <span className="text-xs text-muted-foreground">#{issue_id}</span>
                </CardAction>
            </CardHeader>

            <CardContent>
                {issue_description && (
                    <p className="text-sm text-muted-foreground mb-2">{issue_description}</p>
                )}

                <div className="flex gap-2 flex-wrap items-center">
                    <select
                        value={priorityValue}
                        onChange={handlePriorityChange}
                        disabled={isUpdating}
                        className="rounded-md border px-2 py-1 text-xs"
                    >
                        {PRIORITY_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <select 
                        value={statusValue} 
                        onChange={handleStatusChange} 
                        disabled={isUpdating}>
                        {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} disabled={s === "Resolved" && hasUnresolvedBlockers}>
                            {s}
                        </option>
                        ))}
                    </select>
                    {hasUnresolvedBlockers && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Blocked by {blockingThisIssue.length} unresolved sub-issue(s)
                         </p>
                    )}
                </div>

                {fieldError && <p role="alert" className="text-xs text-destructive mt-1">{fieldError}</p>}

                {parent_issue_id && (
                    <p className="text-xs text-muted-foreground mt-2">Sub-issue of #{parent_issue_id}</p>
                )}

                 {deleteError && <p role="alert" className="text-sm text-destructive mt-1">{deleteError}</p>}

                {subIssues.length > 0 && (
                    <div className="mt-3 border-t pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-xs px-0"
                            onClick={() => setIsExpanded((prev) => !prev)}
                        >
                            {isExpanded ? "Hide" : "View"} {subIssues.length} sub-{subIssues.length === 1 ? "issue" : "issues"}
                        </Button>

                        {isExpanded && (
                            <div className="mt-2 flex flex-col gap-2 pl-3 border-l">
                                {subIssues.map((sub) => (
                                    <IssueCard
                                        key={sub.issue_id}
                                        issue={sub}
                                        subIssues={sub.other_issues ?? []} 
                                        user={user}
                                        users={users}
                                        workspaceId={workspaceId}
                                        projectId={projectId}
                                        depth={depth + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

               
            </CardContent>

            <CardFooter className="justify-end gap-2 flex-wrap">
                {canEdit && (
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger render={<Button type="button" variant="outline" className="text-sm">Edit</Button>} />
                        <DialogContent className="sm:max-w-sm">
                            <form onSubmit={handleEditSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Edit Issue</DialogTitle>
                                    <DialogDescription>Update the issue's name and description.</DialogDescription>
                                </DialogHeader>

                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor={`edit-issue-name-${issue_id}`}>Issue Name</Label>
                                        <Input
                                            id={`edit-issue-name-${issue_id}`}
                                            name="issue_name"
                                            value={editForm.issue_name}
                                            onChange={handleEditChange}
                                            disabled={isUpdating}
                                        />
                                    </Field>
                                    <Field>
                                        <Label htmlFor={`edit-issue-desc-${issue_id}`}>Description</Label>
                                        <Input
                                            id={`edit-issue-desc-${issue_id}`}
                                            name="issue_description"
                                            value={editForm.issue_description}
                                            onChange={handleEditChange}
                                            disabled={isUpdating}
                                        />
                                    </Field>

                                    <Field>
                                        <Label htmlFor={`edit-issue-priority-${issue_id}`}>Priority</Label>
                                        <select
                                            id={`edit-issue-priority-${issue_id}`}
                                            name="issue_priority"
                                            value={editForm.issue_priority}
                                            onChange={handleEditChange}
                                            disabled={isUpdating}
                                            className="border rounded-md px-2 py-1"
                                         >
                                            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </Field>

                                    <Field>
                                        <Label htmlFor={`edit-issue-status-${issue_id}`}>Status</Label>
                                        <select
                                            id={`edit-issue-status-${issue_id}`}
                                            name="issue_status"
                                            value={editForm.issue_status}
                                            onChange={handleEditChange}
                                            disabled={isUpdating}
                                            className="border rounded-md px-2 py-1"
                                        >
                                             {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </Field>

                                    {editError && (
                                        <p role="alert" className="text-sm text-destructive">{editError}</p>
                                    )}
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
                )}

                {canDelete && (
                     confirmingDelete ? (
                        <span className="flex flex-col items-end gap-1">
                            {subIssueCountForWarning > 0 && (
                                <p className="text-xs text-destructive">
                                    This will also delete {subIssueCountForWarning} sub-issue{subIssueCountForWarning === 1 ? "" : "s"}.
                                </p>
                            )}
                            <span className="flex gap-1">
                                <Button type="button" variant="destructive" className="text-sm" onClick={handleDeleteClick} disabled={isDeleting}>
                                    {isDeleting ? "Deleting…" : "Confirm Delete"}
                                </Button>
                                <Button type="button" variant="outline" className="text-sm" onClick={() => setConfirmingDelete(false)}>
                                    Cancel
                                </Button>
                            </span>
                        </span>
                    ) : (
                        <Button type="button" variant="destructive" className="text-sm" onClick={() => setConfirmingDelete(true)}>
                            Delete
                        </Button>
                    )
                )}

                <CreateIssueForm
                    user={user}
                    workspaceId={workspaceId}
                    projectId={projectId}
                    parentIssueId={issue_id}
                    triggerLabel="Add Sub-issue"
                    triggerVariant="outline"
                />
            </CardFooter>
        </Card>
    );
}