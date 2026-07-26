import { 
    findAllIssues,
    findIssueById,
    findIssueByName,
    createIssue,
    updateIssue,
    deleteIssue
 } from "../repositories/issues.repository";
 import ValidationError from "../domain/errors/validation-error";
 import NotFoundError from "../domain/errors/not-found-error";
 import { createIssueSchema,updateIssueSchema } from "../domain/dto/createIssue.dto";
 import { findProjectById } from "../repositories/projects.repository";



const structured_issues = (issue:any) => ({
    ...issue,
    assignee:issue.issue_assignees?.map((ia:any) => ia.users)??[],
    reporter:issue.users,
    labels:issue.issue_labels?.map((ia:any) => ia.labels)??[],
    project:issue.projects,
    users: undefined,
    issue_labels:undefined,
    issue_assignees: undefined,
    projects:undefined
})


 const getAllIssues = async (query:{
    status?:string,
    assignee?:number,
    reporter?:number,
    priority?:string,
    labels?:number[],
    page?:string,
    limit?:string
}, project_id:number, workspace_id:number) => {

    const page = Math.max(1,Number(query.page) || 1);
    const limit = Math.min(100,Math.max(1,Number(query.limit || 10)));

    const assignee = query.assignee ? Number(query.assignee) : undefined;   
    if (query.assignee && isNaN(assignee as number)) {
    throw { status: 400, message: "assignee must be a valid number" };
    }

    const reporter = query.reporter ? Number(query.reporter) : undefined;
    if (query.reporter && isNaN(reporter as number)) {
        throw { status: 400, message: "reporter must be a valid number" };
    } 

    const validStatus = ["To Check","In Progress","Resolved"]
    if(query.status && !validStatus.includes(query.status)){
        throw { status: 400, message: "Invalid status value" };
    }

    const validPriority = ["Low","Medium","High"]
    if(query.priority && !validPriority.includes(query.priority)){
        throw { status: 400, message: "Invalid priority value" };
    }

     const project = await findProjectById(project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new NotFoundError("Project not found");
    }

    const {issues, totalCount} = await findAllIssues({
        project_id,
        status:query.status,
        assignee,
        reporter,
        priority:query.priority,
        labels:query.labels,
        page,
        limit
    });

    return {
        data:issues.map(structured_issues),
        pagination:{
            page,
            limit,
            totalCount,
            totalPages:Math.ceil(totalCount/limit),
        },
    };


 };

 const getIssueById = async(issue_id:number, project_id:number, workspace_id:number) => {

    const issue = await findIssueById(issue_id);
     if (
        !issue ||
        issue.project_id !== project_id ||
        issue.projects.workspace_id !== workspace_id
    ) {
        throw new NotFoundError("issue not found!");
    }
    return structured_issues(issue)

 };

 const getIssueByName = async(issue_name:string , project_id:number, workspace_id:number) => {

    const issues = await findIssueByName(issue_name)
    const issue = issues.find((issue) => issue.project_id === project_id && issue.projects.workspace_id === workspace_id)
    if(!issue){
        throw new NotFoundError("issue not found!");
    }

    return structured_issues(issue);


 }

 const CreateIssue = async (data:{
    issue_name:string,
    issue_description?:string,
    issue_reporter:number,
    issue_priority:string,
    issue_status:string,
    project_id:number,
    assignee_ids?:number[]
    },workspace_id:number) => {

    const project = await findProjectById(data.project_id);
    if (!project || project.workspace_id !== workspace_id) {
        throw new NotFoundError("Project not found");
    }

    const parsed = createIssueSchema.safeParse(data)
    if(!parsed.success){
        throw new ValidationError("validation error")
    }

    const issue = await createIssue(parsed.data)
    return issue;

 };

 const UpdateIssue = async (issue_id:number, project_id:number,workspace_id:number, data:Partial<{
    issue_name:string,
    issue_description:string,
    issue_priority:string,
    issue_status:string
 }>) => {

    try{

    const issue = await findIssueById(issue_id)

    if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
          throw new NotFoundError("issue not found!");
      }

     const parsed = updateIssueSchema.safeParse(data);

    if(!parsed.success){
        throw new ValidationError("Bad request")
    }

    return await updateIssue(issue_id,parsed.data)

    }catch(error){

     throw error;

    }
 };



    const DeleteIssue = async(issue_id: number , project_id:number , workspace_id:number) => {

        const issue = await findIssueById(issue_id);
        if (!issue || issue.project_id !== project_id || issue.projects.workspace_id !== workspace_id) {
        throw new NotFoundError("issue not found!");
    }

        return await deleteIssue(issue_id)

    }

export {
    getAllIssues,
    getIssueById,
    getIssueByName,
    CreateIssue,
    UpdateIssue,
    DeleteIssue
}



    


