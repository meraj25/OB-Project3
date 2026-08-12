import {FolderOpen} from "lucide-react"
import { Button } from "./ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty"
import CreateIssueForm from "./createIssuesForm.component"

export function EmptyIssuesDemo({user,workspaceId,projectId}) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16 [&_svg]:size-8">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle className="text-2xl">No Issues Yet</EmptyTitle>
        <EmptyDescription className="text-base max-w-md">
          You haven&apos;t created any Issue yet. Get started by creating
          your first Issue.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateIssueForm user={user} workspaceId={workspaceId} projectId={projectId}/>
      </EmptyContent>
    </Empty>
  )
}
