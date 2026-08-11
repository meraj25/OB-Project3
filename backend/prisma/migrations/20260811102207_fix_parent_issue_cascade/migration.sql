-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_parent_issue_id_fkey";

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_parent_issue_id_fkey" FOREIGN KEY ("parent_issue_id") REFERENCES "issues"("issue_id") ON DELETE CASCADE ON UPDATE NO ACTION;
