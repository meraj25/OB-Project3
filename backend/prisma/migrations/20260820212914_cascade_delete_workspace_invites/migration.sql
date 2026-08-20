-- DropForeignKey
ALTER TABLE "workspace_invites" DROP CONSTRAINT "workspace_invites_workspace_id_fkey";

-- AddForeignKey
ALTER TABLE "workspace_invites" ADD CONSTRAINT "workspace_invites_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE CASCADE ON UPDATE CASCADE;
