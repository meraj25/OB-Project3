import { Request,Response,NextFunction } from "express";
import { getAllWorkspaceMembers,createMember,updateMember,deleteMember } from "../services/workspace_members.service";
import { error } from "node:console";

const GetAllWorkspaceMembers = async (req:Request,res:Response,next:NextFunction) => {

    try{
        const workspace_id = Number(req.params.workspace_id)
        const members = await getAllWorkspaceMembers(workspace_id)

        res.status(200).json(members)

    }catch(error){
        next(error)
    }

};

const CreateMember = async (req:Request,res:Response,next:NextFunction) => {

    try{
        const workspace_id = Number(req.params.workspace_id);
        const {user_id , role_id} = req.body;

        const member = await createMember({workspace_id,user_id,role_id});
        res.status(201).json(member);

    }catch(error){
        next(error)
    }

};

const UpdateMember = async (req:Request,res:Response,next:NextFunction) => {

    try{

        const workspace_id = Number(req.params.workspace_id);
        const workspace_member_id = Number(req.params.member_id);
        const { role_id } = req.body;

        const member = await updateMember(workspace_id,workspace_member_id,role_id)
        res.status(200).json(member)


    }catch(error){
        next(error)
    }
};

const DeleteMember = async (req:Request,res:Response,next:NextFunction) => {

    try{

        const workspace_member_id = Number(req.params.member_id)
        const workspace_id = Number(req.params.workspace_id)

        await deleteMember(workspace_id,workspace_member_id)
        res.status(204).send

    }catch(error){

        next(error)
    }
}

export {
    GetAllWorkspaceMembers,
    CreateMember,
    UpdateMember,
    DeleteMember

}