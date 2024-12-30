'use client'

import { IPostDocument } from "@/mongodb/models/post"
import { SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import CommentFeed from "./CommentFeed";
import CommentForm from "./CommentForm";
import { toast } from "sonner";


function PostOptions({ post }: { post: IPostDocument }) {

    const [isCommentsOpen, setIsCommentOpen] = useState(false);
    const { user } = useUser();
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true);
        }
    }, [post, user])

    const likeOrUnlikePost = async () => {
        if (!user?.id) {
            throw new Error("User not authenticated")
        }

        const originalLiked = liked;
        const originalLikes = likes;

        const newLikes = likes ? likes?.filter((like) => like !== user.id) : [...(likes ?? []), user.id]

        const body: LikePostRequestBody | UnlikePostRequestBody = {
            userId: user.id
        }

        setLiked(!liked)
        setLikes(newLikes)

        const response = await fetch(`/api/posts/${post._id}/${liked ? "unlike" : "like"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to Like or Unlike post")
        }

        const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
        if (!fetchLikesResponse.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error("Failed to fetch likes");
        }

        const newLikedData = await fetchLikesResponse.json();

        setLikes(newLikedData)
    }



    return (
        <div>
            <div className="flex justify-between p-4">
                <div>
                    {likes && likes.length > 0 && (
                        <p className="text-xs text-gray-500 cursor-pointer hover:underline">{likes.length} likes</p>
                    )}
                </div>
                <div>
                    {post?.comments && post?.comments.length > 0 && (
                        <p onClick={() => setIsCommentOpen(!isCommentsOpen)} className="text-xs text-gray-500 cursor-pointer hover:underline">{post.comments.length} comments</p>
                    )}
                </div>
            </div>

            <div className="flex p-2 justify-between px-2 border-t">
                <Button variant="ghost" className="postButton" onClick={() => {
                    const promise = likeOrUnlikePost();

                    toast.promise(promise, {
                        loading: liked ? "Unliking post..." : "Liking post...",
                        success: liked ? "Post unliked" : "Post Liked",
                        error: liked ? "Failed to unlike post" : "Failed to like post"
                    })
                }}>
                    <div className="flex flex-col items-center justify-center">
                        <ThumbsUpIcon className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")} />
                        <div>Like</div>
                    </div>
                </Button>

                <Button variant="ghost" className="postButton" onClick={() => setIsCommentOpen(!isCommentsOpen)}>
                    <div className="flex flex-col items-center justify-center">
                        <MessageCircle className={cn("mr-1", isCommentsOpen && "text-gray-600 fill-gray-600")} />
                        <div>Comment</div>
                    </div>
                </Button>

                <Button variant="ghost" className="postButton">
                    <div className="flex flex-col items-center justify-center">
                        <Repeat2 className="mr-1" />
                        <div>Repost</div>
                    </div>
                </Button>
                <Button variant="ghost" className="postButton">
                    <div className="flex flex-col items-center justify-center">
                        <Send className="mr-1" />
                        <div>Send</div>
                    </div>
                </Button>
            </div>

            {isCommentsOpen && (
                <div className="p-4">
                    <SignedIn>
                        <CommentForm postId={post._id.toString()} />
                    </SignedIn>
                    <CommentFeed post={post} />
                </div>
            )}

        </div>
    )
}

export default PostOptions
