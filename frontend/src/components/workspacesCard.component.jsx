import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";


export function WorkspaceCard({ workspace }) {
  const { workspace_name, created_at, created_by } = workspace;

  const formattedDate = new Date(created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(created_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{workspace_name}</CardTitle>
        <CardDescription>
          Created by {created_by?.user.user_name ?? "Unknown"} on {formattedDate} at {formattedTime}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}