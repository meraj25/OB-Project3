import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import {
    Message,
    MessageAvatar,
    MessageContent,
    MessageHeader,
    MessageFooter,
} from "./ui/message";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { useGetIssueCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from "../lib/api";

function initials(name) {
    if (!name) return "?";
    return name.slice(0, 2).toUpperCase();
}

export function CommentSection({ issue, workspaceId, projectId, user }) {
    const { issue_id } = issue;

 
    const { data: commentsResponse, isLoading } = useGetIssueCommentsQuery({
        workspaceId,
        projectId,
        issueId: issue_id,
    });
    console.log(commentsResponse,"commentsResponse")

    const comments = Array.isArray(commentsResponse) ? commentsResponse : commentsResponse?.data ?? [];
    console.log(comments, "comments")

    const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!text.trim()) return;

        try {
            await createComment({ workspaceId, projectId, issueId: issue_id, comment: text.trim() }).unwrap();
            setText("");
        } catch {
            setError("Couldn't post comment. Please try again.");
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment({ workspaceId, projectId, issueId: issue_id, commentId }).unwrap();
        } catch {
            setError("Couldn't delete comment.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button type="button" variant="outline" className="relative text-sm">
                        Comments
                        {comments.length > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                                {comments.length}
                            </span>
                        )}
                    </Button>
                }
            />

            <DialogContent className="sm:max-w-md flex flex-col max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                    <DialogDescription>{issue.issue_name}</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <p className="text-xs text-muted-foreground">Loading comments…</p>
                    ) : comments.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {comments.map((c) => {
                                const isMine = c.user_id === user?.user_id;
                                return (
                                    <Message key={c.comment_id} align={isMine ? "end" : "start"} className="group">
                                        <MessageAvatar>
                                            <Avatar>
                                                <AvatarFallback>{initials(c.users?.user_name)}</AvatarFallback>
                                            </Avatar>
                                        </MessageAvatar>
                                        <MessageContent>
                                            <MessageHeader className={`${isMine ? "text-right" : "text-left"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                {c.users?.user_name ?? "Unknown"}
                                            </MessageHeader>
                                            <Bubble variant={isMine ? "primary" : "muted"}>
                                                <BubbleContent>{c.comment}</BubbleContent>
                                            </Bubble>
                                            <MessageFooter className={`flex items-center gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(c.created_at).toLocaleTimeString(undefined, {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                {isMine && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(c.comment_id)}
                                                        className="h-auto py-0 text-xs text-destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </MessageFooter>
                                        </MessageContent>
                                    </Message>
                                );
                            })}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-1 pt-2 border-t">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment…"
                        disabled={isPosting}
                        className="text-sm"
                    />
                    <Button type="submit" disabled={isPosting || !text.trim()} className="text-sm">
                        {isPosting ? "Posting…" : "Post"}
                    </Button>
                </form>

                {error && <p role="alert" className="text-xs text-destructive">{error}</p>}

                <DialogFooter>
                    <DialogClose render={<Button type="button" variant="outline">Close</Button>} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}