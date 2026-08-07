import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useGetAllUsersQuery } from "@/lib/api";

export function WorkspaceCard({ workspace }) {
  const { data: users = [] } = useGetAllUsersQuery();
  const { workspace_name, created_at, created_by, workspace_id } = workspace;

  const creator = users.find((u) => u.user_id === created_by);

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
          Created by {creator?.user_name ?? "Unknown"} on {formattedDate} at {formattedTime}
        </CardDescription>
        <CardAction>
          <span className="text-xs text-muted-foreground">#{workspace_id}</span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {creator?.user_email ?? "No contact email on file"}
        </p>
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <button className="text-sm underline">View</button>
      </CardFooter>
    </Card>
  );
}