import React, { useEffect, useMemo } from "react";
import {
    useGetAllProjectsQuery,
    useGetUserQuery,
    useGetAllWorkspaceMembersQuery,
    useGetAllUsersQuery,
} from "@/lib/api";
import { useParams, useNavigate } from "react-router";
import CreateProjectForm from "../components/createProject.component";
import { ProjectCard } from "../components/projectsCard.component";
import { InviteMemberForm } from "../components/inviteMember.component";
import { WorkspaceMemberRow } from "../components/editWorkspaceMember.component";
import { EmptyProjectsDemo } from "@/components/emptyProjects.component";

const ROLE_NAME_FALLBACK = {
    1: "owner",
    2: "executive_member",
    3: "member",
};
const OWNER_ROLE_ID = 1;

function ProjectsPage() {

    const params = useParams();
    console.log(params); 
    const { workspace_id } = useParams();
    const navigate = useNavigate();
    const numericWorkspaceId = Number(workspace_id);

    const { data: projects = [], isLoading: isProjectsLoading } = useGetAllProjectsQuery({
        workspaceId: numericWorkspaceId,
    });
    console.log(projects,"projects")
    const { data: { user } = {}, isLoading: isUserLoading } = useGetUserQuery();
    const { data: workspaceMembers = [] } = useGetAllWorkspaceMembersQuery();
    const { data: users = [] } = useGetAllUsersQuery();

    const validUser = Boolean(user);

    useEffect(() => {
        if (!isUserLoading && !validUser) {
            navigate("/login", { replace: true });
        }
    }, [isUserLoading, validUser, navigate]);

    const membersInThisWorkspace = useMemo(() => {
        return workspaceMembers
            .filter((m) => m.workspace_id === numericWorkspaceId)
            .map((m) => {
                const member = users.find((u) => u.user_id === m.user_id);
                const roleName = m.role_name ?? ROLE_NAME_FALLBACK[m.role_id] ?? "unknown";
                return { ...m, user_name: member?.user_name ?? "Unknown user", role_display: roleName };
            });
    }, [workspaceMembers, users, numericWorkspaceId]);

    const existingMemberUserIds = useMemo(
        () => membersInThisWorkspace.map((m) => m.user_id),
        [membersInThisWorkspace]
    );

    const myMembership = membersInThisWorkspace.find((m) => m.user_id === user?.user_id);
    const canInviteMembers = myMembership?.role_id === OWNER_ROLE_ID;

    if (isUserLoading) return <p>Checking your session…</p>;
    if (!validUser) return null;
    if (isProjectsLoading) return <p>Loading Projects...</p>;

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Projects</h1>
                <CreateProjectForm user={user} workspaceId={numericWorkspaceId} />
            </div>

            <div>
                <div className="flex items-center justify-between mt-4 mb-2">
                    <h2 className="text-sm font-semibold text-muted-foreground">Members</h2>
                    {canInviteMembers && (
                        <InviteMemberForm
                            workspaceId={numericWorkspaceId}
                            users={users}
                            existingMemberUserIds={existingMemberUserIds}
                        />
                    )}
                </div>
                {membersInThisWorkspace.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members found.</p>
                ) : (
                    <ul className="flex flex-wrap gap-2">
                        {membersInThisWorkspace.map((member) => (
                        <WorkspaceMemberRow
                            key={member.workspace_member_id}
                            member={member}
                            workspaceId={numericWorkspaceId}
                            canManage={canInviteMembers} 
                            isSelf={member.user_id === user?.user_id}
                        />
                         ))}
                    </ul>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {projects.length === 0 ? (
                    <EmptyProjectsDemo user={user} workspaceId={numericWorkspaceId}/>
                ) : (
                    projects.map((project) => (
                        <ProjectCard key={project.project_id} project={project} user={user} workspaceId={numericWorkspaceId} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProjectsPage;