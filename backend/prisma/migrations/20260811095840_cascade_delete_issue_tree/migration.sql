-- DropForeignKey
ALTER TABLE "issue_comments" DROP CONSTRAINT "issue_comments_chain_id_fkey";

-- DropForeignKey
ALTER TABLE "issue_comments_chain" DROP CONSTRAINT "issue_comments_chain_issue_id_fkey";

-- DropForeignKey
ALTER TABLE "issue_labels" DROP CONSTRAINT "issue_labels_issue_id_fkey";

-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_issue_reporter_fkey";

-- AddForeignKey
ALTER TABLE "issue_comments" ADD CONSTRAINT "issue_comments_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "issue_comments_chain"("chain_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_issue_reporter_fkey" FOREIGN KEY ("issue_reporter") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "issue_comments_chain" ADD CONSTRAINT "issue_comments_chain_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("issue_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "issue_labels" ADD CONSTRAINT "issue_labels_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("issue_id") ON DELETE CASCADE ON UPDATE NO ACTION;
