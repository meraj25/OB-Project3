import { useState, useMemo } from "react";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useCreateWorkspaceInviteMutation, useGetUserByIdQuery } from "@/lib/api";


const INVITABLE_ROLES = [
    { role_id: 2, role_name: "executive_member" },
    { role_id: 3, role_name: "member" },
];

export function InviteMemberForm({ workspaceId, users, existingMemberUserIds }) {
    const [createWorkspaceMemberInvite, { isLoading }] = useCreateWorkspaceInviteMutation();

    const [mode, setMode] = useState("existing"); 
    const [selectedUserId, setSelectedUserId] = useState("");
    const [manualEmail, setManualEmail] = useState("");
    const [selectedRoleId, setSelectedRoleId] = useState(String(INVITABLE_ROLES[1].role_id));
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const invitableUsers = useMemo(
        () => users.filter((u) => !existingMemberUserIds.includes(u.user_id)),
        [users, existingMemberUserIds]
    );

    const { data: invite_user } = useGetUserByIdQuery(Number(selectedUserId), {
        skip: mode !== "existing" || !selectedUserId,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        let emailToInvite;

        if (mode === "existing") {
            if (!selectedUserId) {
                setError("Please select a person to invite.");
                return;
            }
            emailToInvite = invite_user?.user_email;
        } else {
            if (!manualEmail.trim()) {
                setError("Please enter an email address.");
                return;
            }
            emailToInvite = manualEmail.trim();
        }

        try {
            await createWorkspaceMemberInvite({
                workspaceId,
                body: {
                    user_email: String(emailToInvite),
                    role_id: Number(selectedRoleId),
                },
            }).unwrap();
            setSelectedUserId("");
            setManualEmail("");
            setOpen(false);
        } catch (err) {
            setError(err?.data?.message ?? "Couldn't send invite. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button type="button" variant="outline">Invite Member</Button>} />
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Invite a Member</DialogTitle>
                        <DialogDescription>Add someone to this workspace and assign their role.</DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-2 mb-2">
                        <Button
                            type="button"
                            variant={mode === "existing" ? "default" : "outline"}
                            onClick={() => setMode("existing")}
                            disabled={isLoading}
                        >
                            Existing user
                        </Button>
                        <Button
                            type="button"
                            variant={mode === "email" ? "default" : "outline"}
                            onClick={() => setMode("email")}
                            disabled={isLoading}
                        >
                            Invite by email
                        </Button>
                    </div>

                    <FieldGroup>
                        {mode === "existing" ? (
                            <Field>
                                <Label htmlFor="invite_user">Person</Label>
                                <select
                                    id="invite_user"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    disabled={isLoading}
                                    className="border rounded-md px-2 py-1"
                                >
                                    <option value="" disabled>Select a person…</option>
                                    {invitableUsers.map((u) => (
                                        <option key={u.user_id} value={u.user_id}>
                                            {u.user_name} ({u.user_email})
                                        </option>
                                    ))}
                                </select>
                                {invitableUsers.length === 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Everyone registered is already a member of this workspace.
                                    </p>
                                )}
                            </Field>
                        ) : (
                            <Field>
                                <Label htmlFor="invite_email">Email</Label>
                                <Input
                                    id="invite_email"
                                    type="email"
                                    placeholder="person@example.com"
                                    value={manualEmail}
                                    onChange={(e) => setManualEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    They'll receive an email invite even if they don't have an account yet.
                                </p>
                            </Field>
                        )}

                        <Field>
                            <Label htmlFor="invite_role">Role</Label>
                            <select
                                id="invite_role"
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                                disabled={isLoading}
                                className="border rounded-md px-2 py-1"
                            >
                                {INVITABLE_ROLES.map((r) => (
                                    <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                                ))}
                            </select>
                        </Field>
                    </FieldGroup>

                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
                        <Button
                            type="submit"
                            disabled={isLoading || (mode === "existing" && invitableUsers.length === 0)}
                        >
                            {isLoading ? "Inviting…" : "Invite Member"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}