import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api',
  credentials: "include",
});

let refreshPromise = null;

const baseQueryWithReauth = async (args , api , extraOptions) => {

  let result = await baseQuery(args , api , extraOptions);

   if (result.error?.status === 401) {
    if (!refreshPromise) {

       refreshPromise = baseQuery(
        { url: "/users/refresh", method: "POST" },
        api,
        extraOptions
      ).finally(() => {
        refreshPromise = null; 
      });
    }


    const refreshResult = await refreshPromise;

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(Api.util.resetApiState());
      window.location.href = '/login';
    }
  }

  return result;
};

export const Api = createApi({
  reducerPath: 'Api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Issue', 'Project', 'Workspace', 'WorkspaceMember', 'BlockedIssue'],
  endpoints: (build) => ({


   registerUser: build.mutation({
      query: (user) => ({
        url: '/users/register',
        method: 'POST',
        body: user,
      }),

      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }), 

    getAllUsers: build.query({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: build.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),

    loginUser: build.mutation({
      query: (form) => ({
        url: '/users/login',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: build.mutation({
      query: ({ userId, ...user }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: user,
      }),
        invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),

    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
        invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }, { type: 'User', id: 'LIST' }],
    }),

    getUser: build.query({
      query: () => '/users/getuser',
      providesTags: (result) =>
        result ? [{ type: 'User', id: result.id }] : [],
    }),

    refreshUser: build.mutation({
      query: () => ({
        url: '/users/refresh',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    logoutUser: build.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    requestPasswordReset: build.mutation({
        query: (email) => ({
            url: '/users/password_reset/request',
            method: 'POST',
            body: { user_email: email }
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    resetPassword: build.mutation({
        query: ({ token, newPassword }) => ({
            url: '/users/password_reset/confirm',
            method: 'POST',
            body: { token, newPassword }
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getAllIssues: build.query({
      query: ({ workspaceId, projectId, filters = {} }) => {

        const params =  new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.assignee) params.append('assignee', filters.assignee);
        if (filters.reporter) params.append('reporter', filters.reporter);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.labels?.length) {
            filters.labels.forEach(id => params.append('labels', id));
        }

        const queryString = params.toString();
        
        return `/issues/workspace/${workspaceId}/project/${projectId}/issues${queryString ? `?${queryString}` : ''}`

      },
      providesTags: (result) =>
        result
          ? [
              ...result.issues.map(({ id }) => ({ type: 'Issue', id })),
              { type: 'Issue', id: 'LIST' },
            ]
          : [{ type: 'Issue', id: 'LIST' }],
   
    }),


    getIssueById: build.query({
        query:({workspaceId,projectId,issueId}) => `/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}`,

        providesTags: (result, error, { issueId }) => [{ type: 'Issue', id: issueId }],
    }),

    createIssue: build.mutation({
        query:({workspaceId,projectId,data}) => ({

            url:`/issues/workspace/${workspaceId}/project/${projectId}/issue/create`,
            method:"POST",
            body:data,

        }),
        invalidatesTags: [{ type: 'Issue', id: 'LIST' }],
    }),

    updateIssue: build.mutation({
        query:({workspaceId,projectId,issueId,...issue}) => ({
            url:`/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}/update`,
            method:"PATCH",
            body:issue,
        }),
        invalidatesTags: (result, error, { issueId }) => [{ type: 'Issue', id: issueId }, { type: 'Issue', id: 'LIST' }],
    }),

    deleteIssue: build.mutation({
        query:({issueId,projectId,workspaceId}) => ({
            url:`/issues/workspace/${workspaceId}/project/${projectId}/issue/${issueId}/delete`,
            method:"DELETE",
        }),
        invalidatesTags: (result, error, { issueId }) => [{ type: 'Issue', id: issueId }, { type: 'Issue', id: 'LIST' }],
    }),

    getAllProjects: build.query({
        query:({workspaceId}) => `/projects/workspace/${workspaceId}/projects`,

        providesTags: (result) =>
        result
          ? [
              ...result.projects.map(({ id }) => ({ type: 'Project', id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),

    getProjectById: build.query({
        query:({workspaceId,projectId}) => `/projects/workspace/${workspaceId}/project/${projectId}`,

        
        providesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }],
    }),

    createProject: build.mutation({
        query:({workspaceId,project}) => ({
            url:`/projects/workspace/${workspaceId}/project/create`,
            method:"POST",
            body:project,
        }),
        invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: build.mutation({
        query:({workspaceId,projectId,...project}) => ({
            url:`/projects/workspace/${workspaceId}/project/${projectId}/update`,
            method:"PATCH",
            body:project,
        }),
        invalidatesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }, { type: 'Project', id: 'LIST' }],
    }),

    deleteProject: build.mutation({
        query:({workspaceId,projectId}) => ({
            url:`/projects/workspace/${workspaceId}/project/${projectId}/delete`,
            method:"DELETE",
        }),
        invalidatesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }, { type: 'Project', id: 'LIST' }],
    }),

    getAllWorkspaces: build.query({
        query:() => `/workspaces`,
        providesTags: (result) =>
        result
          ? [
              ...result.workspaces.map(({ id }) => ({ type: 'Workspace', id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }],
    }),

    getWorkspaceById: build.query({
        query:({workspaceId}) => `/workspaces/workspace/${workspaceId}`,
        providesTags: (result, error, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }],
    }),

    createWorkspace: build.mutation({
        query:(workspace_name) => ({
            url:`/workspaces/create`,
            method:"POST",
            body:{ workspace_name },
        }),

        invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    updateWorkspace: build.mutation({
        query:({workspaceId,...data}) => ({
            url:`/workspaces/workspace/${workspaceId}/update`,
            method:"PATCH",
            body:data,
        }),
        invalidatesTags: (result, error, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }, { type: 'Workspace', id: 'LIST' }],
    }), 

    deleteWorkspace: build.mutation({
        query:({workspaceId}) => ({
            url:`/workspaces/workspace/${workspaceId}/delete`,
            method:"DELETE",
        }),

        invalidatesTags: (result, error, { workspaceId }) => [{ type: 'Workspace', id: workspaceId }, { type: 'Workspace', id: 'LIST' }],
    }),

    getAllWorkspaceMembers: build.query({
        query:({workspaceId}) => `/workspaces/${workspaceId}/members`,

        providesTags: (result) =>
        result
          ? [
              ...result.members.map(({ id }) => ({ type: 'WorkspaceMember', id })),
              { type: 'WorkspaceMember', id: 'LIST' },
            ]
          : [{ type: 'WorkspaceMember', id: 'LIST' }],
    }),

    createWorkspaceMember: build.mutation({
        query:({workspaceId,body}) => ({
            url:`/workspaces/workspace/${workspaceId}/members`,
            method:"POST",
            body:body,
        }),
        invalidatesTags: [{ type: 'WorkspaceMember', id: 'LIST' }],
    }),

    updateWorkspaceMember: build.mutation({
        query:({workspaceId,memberId,...member}) => ({
            url:`/workspaces/${workspaceId}/member/${memberId}`,
            method:"PATCH",
            body:member,
        }),
        invalidatesTags: (result, error, { memberId }) => [{ type: 'WorkspaceMember', id: memberId }, { type: 'WorkspaceMember', id: 'LIST' }],
    }),

    deleteWorkspaceMember: build.mutation({
        query:({workspaceId,memberId}) => ({
            url:`/workspaces/${workspaceId}/member/${memberId}`,
            method:"DELETE",
        }),

        invalidatesTags: (result, error, { memberId }) => [{ type: 'WorkspaceMember', id: memberId }, { type: 'WorkspaceMember', id: 'LIST' }],
    }),

    getAllBlockedIssues: build.query({
        query:({workspaceId,projectId}) => `/block-issues/workspace/${workspaceId}/project/${projectId}/block-issues`,

        providesTags: (result) =>
        result
          ? [
              ...result.blocked_issues.map(({ id }) => ({ type: 'BlockedIssue', id })),
              { type: 'BlockedIssue', id: 'LIST' },
            ]
          : [{ type: 'BlockedIssue', id: 'LIST' }],
    }),

    getBlockedIssueById: build.query({
        query:({workspaceId,projectId,blockedIssueId,blockingIssueId}) => `/block-issues/workspace/${workspaceId}/project/${projectId}/block-issues/${blockingIssueId}/${blockedIssueId}`,
        providesTags: (result, error, { blockedIssueId }) => [{ type: 'BlockedIssue', id: blockedIssueId }],
    }),
    
    createBlockedIssue: build.mutation({
        query:({workspaceId,projectId,blockingIssueId, blockedIssueId}) => ({
            url:`/block-issues/workspace/${workspaceId}/project/${projectId}/block-issues/create`,
            method:"POST",
            body:{ blocking_issue_id: blockingIssueId, blocked_issue_id: blockedIssueId },
        }),
        invalidatesTags: [{ type: 'BlockedIssue', id: 'LIST' }],
    }),

    deleteBlockedIssue: build.mutation({
        query:({workspaceId,projectId,blockedIssueId,blockingIssueId}) => ({
            url:`/block-issues/workspace/${workspaceId}/project/${projectId}/block-issues/${blockingIssueId}/${blockedIssueId}`,
            method:"DELETE",
        }),
        invalidatesTags: (result, error, { blockedIssueId }) => [{ type: 'BlockedIssue', id: blockedIssueId }, { type: 'BlockedIssue', id: 'LIST' }], 
    })




  }),
})


export const { 
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetUserQuery,
    useRefreshUserMutation,
    useLogoutUserMutation,
    useRequestPasswordResetMutation,
    useResetPasswordMutation,
    useGetAllIssuesQuery,
    useGetIssueByIdQuery,
    useCreateIssueMutation,
    useUpdateIssueMutation,
    useDeleteIssueMutation,
    useGetAllProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetAllWorkspacesQuery,
    useGetWorkspaceByIdQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,
    useGetAllWorkspaceMembersQuery,
    useCreateWorkspaceMemberMutation,
    useUpdateWorkspaceMemberMutation,
    useDeleteWorkspaceMemberMutation,
    useGetAllBlockedIssuesQuery,
    useGetBlockedIssueByIdQuery,
    useCreateBlockedIssueMutation,
    useDeleteBlockedIssueMutation } = Api