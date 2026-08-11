
import React, { useEffect,useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    useGetAllIssuesQuery,
    useGetUserQuery,
    useGetAllUsersQuery,
} from "@/lib/api";
import { IssueCard } from "@/components/issuesCard.component";
import CreateIssueForm from "../components/createIssuesForm.component";
import { EmptyIssuesDemo } from "@/components/emptyIssues.component";

const STATUS_OPTIONS = ["To Check", "In Progress", "Resolved"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const SORT_FIELDS = [
    { value: "issue_id", label: "Newest" },
    { value: "issue_priority", label: "Priority" },
    { value: "issue_status", label: "Status" },
];

function IssuesPage() {
    const { workspace_id, project_id } = useParams();
    const navigate = useNavigate();
    const numericWorkspaceId = Number(workspace_id);
    const numericProjectId = Number(project_id);

    const { data: { user } = {}, isLoading: isUserLoading } = useGetUserQuery();
    const { data: users = [] } = useGetAllUsersQuery();

    const validUser = Boolean(user);

    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        assignee: "",
        reporter: "",
        search: "",
        sortBy: "issue_id",
        sortOrder: "desc",
        page: 1,
        limit: 10,
    });

    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput, page: 1 })); 
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data: issuesResponse, isLoading: isIssuesLoading, isFetching: isIssuesFetching } = useGetAllIssuesQuery({
        workspaceId: numericWorkspaceId,
        projectId: numericProjectId,
        filters, 
    });

    const issues = issuesResponse?.data ?? [];
    const pagination = issuesResponse?.pagination;

    const { topLevelIssues, childrenByParentId } = useMemo(() => {
        const childrenMap = {};
        const topLevel = [];
        for (const issue of issues) {
            if (issue.parent_issue_id) {
                if (!childrenMap[issue.parent_issue_id]) childrenMap[issue.parent_issue_id] = [];
                childrenMap[issue.parent_issue_id].push(issue);
            } else {
                topLevel.push(issue);
            }
        }
        return { topLevelIssues: topLevel, childrenByParentId: childrenMap };
    }, [issues]);

    useEffect(() => {
        if (!isUserLoading && !validUser) {
            navigate("/login", { replace: true });
        }
    }, [isUserLoading, validUser, navigate]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const goToPage = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    if (isUserLoading) return <p>Checking your session…</p>;
    if (!validUser) return null;
    if (isIssuesLoading) return <p>Loading issues…</p>;

console.log("children map:", childrenByParentId);
console.log("top level:", topLevelIssues);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Issues</h1>
                <CreateIssueForm
                    user={user}
                    workspaceId={numericWorkspaceId}
                    projectId={numericProjectId}
                />
            </div>

             <div className="flex flex-wrap gap-2 items-center mt-4">
                <input
                    type="text"
                    placeholder="Search issues…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                />

                <select
                    value={filters.status}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="">All statuses</option>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) => updateFilter("priority", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="">All priorities</option>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>

                <select
                    value={filters.assignee}
                    onChange={(e) => updateFilter("assignee", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="">Any assignee</option>
                    {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.user_name}</option>)}
                </select>

                <select
                    value={filters.reporter}
                    onChange={(e) => updateFilter("reporter", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="">Any reporter</option>
                    {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.user_name}</option>)}
                </select>

                <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    {SORT_FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                <select
                    value={filters.sortOrder}
                    onChange={(e) => updateFilter("sortOrder", e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm"
                >
                    <option value="desc">Latest to Oldest</option>
                    <option value="asc">Oldest to Latest</option>
                </select>
            </div>

            {isIssuesFetching && <p className="text-xs text-muted-foreground mt-2">Updating…</p>}


             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {topLevelIssues.length === 0 ? (
                        <EmptyIssuesDemo user={user} workspaceId={numericWorkspaceId} projectId={numericProjectId} />
                    ) : (
                        topLevelIssues.map((issue) => (
                            <IssueCard
                                key={issue.issue_id}
                                issue={issue}
                                subIssues={childrenByParentId[issue.issue_id] ?? []}
                                user={user}
                                users={users}
                                workspaceId={numericWorkspaceId}
                                projectId={numericProjectId}
                            />
                        ))
                    )}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="border rounded-md px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="border rounded-md px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
}

export default IssuesPage;