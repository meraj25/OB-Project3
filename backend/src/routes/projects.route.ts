import express from "express"
import { 
    GetAllProjects,
    GetProjectById,
    CreateProjectController,
    UpdateProjectController,
    DeleteProjectController } from "../controllers/projects.controller"
import { requireAction } from "../middlewares/requireAction.middleware";
import { validateToken } from "../middlewares/JWT.middleware";
import { attachPermissions } from "../middlewares/permission.middleware";


const ProjectRouter = express.Router();

ProjectRouter
    .route("workspace/:workspace_id")
    .get(
        validateToken,
        attachPermissions,
        GetAllProjects
    );

ProjectRouter
    .route("workspace/:workspace_id/project/:project_id")
    .get(
        validateToken,
        attachPermissions,
        GetProjectById
    );

ProjectRouter
    .route("/workspace/:workspace_id/create")
    .post(
        validateToken,
        attachPermissions,
        requireAction("project:create"),
        CreateProjectController
    );
ProjectRouter
    .route("/workspace/:workspace_id/project/:project_id/update")
    .patch(
        validateToken,
        attachPermissions,
        requireAction("project:update"),
        UpdateProjectController

    );

ProjectRouter
    .route("/workspace/:workspace_id/project/:project_id/delete")
    .delete(
        validateToken,
        attachPermissions,
        requireAction("project:delete"),
        DeleteProjectController
        
    );

    export default ProjectRouter;
