import Navigation from "@/components/navigation.component";
import { useGetUserQuery, useGetAllWorkspaceMembersQuery, useGetAllWorkspacesQuery } from "@/lib/api";
import { EmptyDemo } from "@/components/empty.component";
import { WorkspaceCard } from "@/components/workspacesCard.component";
import CreateWorkspaceForm from "@/components/createWorkspace.component";
import React, { useMemo, useState,useEffect } from "react";
import { useNavigate} from "react-router";
import { Button } from "@/components/ui/button";

function Home() {
    const { data: { user } = {}, isLoading:isUserLoading } = useGetUserQuery();
    const navigate = useNavigate();
    const validUser = Boolean(user);

    const { data: workspaces = [] } = useGetAllWorkspacesQuery();
    const { data: workspacemembers = [], isLoading } = useGetAllWorkspaceMembersQuery();

    console.log(workspaces, "workspaces")
    console.log(workspacemembers, "workspacemembers")

    const [activeTab, setActiveTab] = useState("myWorkspaces");

    useEffect(() => {
        if (!isUserLoading && !validUser) {
            navigate("/login", { replace: true });
        }
    }, [isUserLoading, validUser, navigate]);

    const myWorkspaces = useMemo(
        () => workspaces.filter((workspace) => workspace.created_by === user?.user_id),
        [workspaces, user?.user_id] 
    );

    const myWorkspaceMemberships = useMemo(
        () => workspacemembers.filter((member) => member.user_id === user?.user_id),
        [workspacemembers, user?.user_id]
    );

    const myWorkspacesViaMembership = useMemo(() => {
        const myWorkspaceIds = new Set(myWorkspaceMemberships.map((m) => m.workspace_id));
        return workspaces.filter((ws) => myWorkspaceIds.has(ws.workspace_id));
    }, [workspaces, myWorkspaceMemberships]);

    if (isUserLoading) {
        return <p>Checking your session…</p>;
    }

    if (!validUser) {
        return null; 
    }

    if (isLoading) {
        return <p>Loading your workspaces…</p>;
    }

     const allWorkspaces = () => {
        if (myWorkspacesViaMembership.length === 0) {
            return <EmptyDemo />;
        }
        return myWorkspacesViaMembership.map((workspace) => (
            <WorkspaceCard key={workspace.workspace_id} workspace={workspace} user={user} />
        ));
    };

    const workspaces_by_Me = () => {
        if (myWorkspaces.length === 0) {
            return <EmptyDemo user={user}/>;
        }
        return myWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} user={user}/>
        ));
    };

    const tabButtonClass = (tabName) =>
    activeTab === tabName
        ? "bg-primary text-primary-foreground px-4 py-2 rounded-md"
        : "bg-muted text-muted-foreground px-4 py-2 rounded-md";

    
    console.log(user)
    return (
        <div>
            <Navigation user={user} />

            <main>
                <section>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setActiveTab("myWorkspaces")} className={tabButtonClass("myWorkspaces")}  
                            >
                                My Workspaces
                            </Button>
                            <Button
                                onClick={() => setActiveTab("createdByMe")} className={tabButtonClass("createdByMe")}
                            >
                                Created By Me
                            </Button>
                        </div>
                        

                        <CreateWorkspaceForm user={user} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                        {activeTab === "myWorkspaces" ? allWorkspaces() : workspaces_by_Me()}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;