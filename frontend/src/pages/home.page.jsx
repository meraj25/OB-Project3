import Navigation from "@/components/navigation.component";
import { useGetUserQuery , useGetAllWorkspaceMembersQuery, useGetAllWorkspacesQuery} from "@/lib/api";
import { EmptyDemo } from "@/components/empty.component";
import { WorkspaceCard } from "@/components/workspacesCard.component";
import React, {useMemo} from "react";




function Home () {

    const {data:{user} = {} } = useGetUserQuery();
    const validUser = Boolean(user);

    const {data:workspaces = []} = useGetAllWorkspacesQuery();
    const {data:workspacemembers = [], isLoading} = useGetAllWorkspaceMembersQuery();

    const myWorkspaces = useMemo(
    () => workspaces.filter((workspace) => workspace.created_by === user?.id),
    [user?.id]
    );

    const myWorkspaceMemberships = useMemo(
    () => workspacemembers.filter((member) => member.user_id === user?.id),
    [workspacemembers, user?.id]
    );  

    if(isLoading){
        return <p>Loading your workspaces…</p>;
    }

    const allWorkspaces = () => {
        
        if(myWorkspaceMemberships.length === 0){
        return <EmptyDemo/>
    }else{
    {myWorkspaceMemberships.map((membership) => (
    <WorkspaceCard key={membership.id} workspace={membership} />
    ))}
    }
    }


    const workspaces_by_Me = () => {

        if(myWorkspaces.length === 0){
            return <EmptyDemo/>
        }else{
        {myWorkspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
        }

    }

    return(
        <div>
            <Navigation user={user} />

            <main>
                <section>
                    <div>
                        <button
                            onClick={() => setActiveTab("myWorkspaces")}
                            disabled={activeTab === "myWorkspaces"}
                        >
                            My Workspaces
                        </button>
                        <button
                            onClick={() => setActiveTab("createdByMe")}
                            disabled={activeTab === "createdByMe"}
                        >
                            Created By Me
                        </button>
                    </div>

                    <div>
                        {activeTab === "myWorkspaces" ? allWorkspaces() : workspaces_by_Me()}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home;