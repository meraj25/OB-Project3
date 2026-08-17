import { useState } from "react";
import { Button } from "./ui/button";
import { useUpdateWorkspaceMemberMutation, useDeleteWorkspaceMemberMutation } from "@/lib/api";

const ROLE_OPTIONS = [
    { role_id: 2, role_name: "executive_member" },
    { role_id: 3, role_name: "member" },
];

export function WorkspaceMemberRow({ member, workspaceId, canManage, isSelf }) {
    const [updateWorkspaceMember, { isLoading: isUpdating }] = useUpdateWorkspaceMemberMutation();
    const [deleteWorkspaceMember, { isLoading: isDeleting }] = useDeleteWorkspaceMemberMutation();

  

    const [roleValue, setRoleValue] = useState(member.role_id);
    const [error, setError] = useState("");
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const canEditThisRow = canManage && !isSelf && member.role_id !== 1;

    const handleRoleChange = async (e) => {
        const newRoleId = Number(e.target.value);
        const previousRoleId = roleValue;
        setRoleValue(newRoleId); 
        setError("");

        try {
            await updateWorkspaceMember({
                workspaceId,
                memberId: member.workspace_member_id,
                role_id: newRoleId,
            }).unwrap();
        } catch (err) {
            setRoleValue(previousRoleId); 
            setError(err?.data?.message ?? "Couldn't update role.");
        }
    };

    const handleDeleteConfirm = async () => {
        setError("");
        try {
            await deleteWorkspaceMember({ workspaceId, memberId: member.workspace_member_id }).unwrap();
        } catch (err) {
            setError(err?.data?.message ?? "Couldn't remove member.");
            setConfirmingDelete(false);
        }
    };

    return (
        <li className="flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="text-sm">{member.user_name}</span>

            {canEditThisRow ? (
                <select
                    value={roleValue}
                    onChange={handleRoleChange}
                    disabled={isUpdating}
                    className="text-xs border rounded-md px-1 py-0.5"
                >
                    {ROLE_OPTIONS.map((r) => (
                        <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                    ))}
                </select>
            ) : (
                <span className="text-xs text-muted-foreground">{member.role_display}</span>
            )}

            {canEditThisRow && (
                confirmingDelete ? (
                    <span className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="destructive"
                            className="text-xs"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Removing…" : "Confirm"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-xs"
                            onClick={() => setConfirmingDelete(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                    </span>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-destructive"
                        onClick={() => setConfirmingDelete(true)}
                    >
                        Remove
                    </Button>
                )
            )}

            {error && <span className="text-xs text-destructive">{error}</span>}
        </li>
    );
}