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

export function EmptyDemo() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-16 [&_svg]:size-8">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle className="text-2xl">No Workspaces Yet</EmptyTitle>
        <EmptyDescription className="text-base max-w-md">
          You haven&apos;t created any Workspaces yet. Get started by creating
          your first workspace.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button size="lg">Create Workspace</Button>
      </EmptyContent>
    </Empty>
  )
}
