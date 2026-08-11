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
import CreateProjectForm from "./createProject.component"

export function EmptyProjectsDemo({user,workspaceId}) {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16 [&_svg]:size-8">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle className="text-2xl">No Projects Yet</EmptyTitle>
        <EmptyDescription className="text-base max-w-md">
          You haven&apos;t created any Projects yet. Get started by creating
          your first Project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateProjectForm user={user} workspaceId={workspaceId}/>
      </EmptyContent>
    </Empty>
  )
}
