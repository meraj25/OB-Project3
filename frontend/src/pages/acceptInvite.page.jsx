import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { 
    useGetUserQuery,
    useAcceptMembershipInviteMutation, 
    useGetInviteDetailsQuery, 
    useDeclineWorkspaceInviteMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";

function AcceptInvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { data: { user } = {}, isLoading: isUserLoading } = useGetUserQuery();
    const { data: invite, isLoading: isInviteLoading, error: inviteError } = useGetInviteDetailsQuery(token);
    const [acceptInvite, { isLoading: isAccepting }] = useAcceptMembershipInviteMutation();
    const [declineInvite, { isLoading: isDeclining }] = useDeclineWorkspaceInviteMutation();

    const [actionError, setActionError] = useState("");
    const [result, setResult] = useState(null); 

    if (isUserLoading || isInviteLoading) return <p>Loading invite…</p>;

    if (inviteError) return <p>This invite doesn't exist.</p>;
    if (invite.status !== "pending") return <p>This invite has already been {invite.status}.</p>;
    if (invite.expired) return <p>This invite has expired.</p>;

    if (!user) {
        
        return (
            <div>
                <p>You've been invited to join <strong>{invite.workspace_name}</strong> as {invite.role_name}.</p>
                <button onClick={() => navigate(`/login?redirect=/invites/${token}`)}>
                    Log in to respond
                </button>
            </div>
        );
    }

    if (result === "accepted") {
        return (
            <div>
                <p>You've joined {invite.workspace_name}!</p>
                <button onClick={() => navigate("/")}>Go to your workspaces</button>
            </div>
        );
    }
    if (result === "declined") {
        return <p>Invite declined.</p>;
    }

    const handleAccept = async () => {
        setActionError("");
        try {
            await acceptInvite(token).unwrap();
            setResult("accepted");
        } catch (err) {
            setActionError(err?.data?.message ?? "Couldn't accept the invite.");
        }
    };

    const handleDecline = async () => {
        setActionError("");
        try {
            await declineInvite(token).unwrap();
            setResult("declined");
        } catch (err) {
            setActionError(err?.data?.message ?? "Couldn't decline the invite.");
        }
    };

    return (
        <div>
            <p>You've been invited to join <strong>{invite.workspace_name}</strong> as {invite.role_name}.</p>
            {actionError && <p role="alert">{actionError}</p>}
            <Button onClick={handleAccept} disabled={isAccepting || isDeclining}>
                {isAccepting ? "Accepting…" : "Accept"}
            </Button>
            <Button onClick={handleDecline} disabled={isAccepting || isDeclining}>
                {isDeclining ? "Declining…" : "Decline"}
            </Button>
        </div>
    );
}


export default AcceptInvitePage;