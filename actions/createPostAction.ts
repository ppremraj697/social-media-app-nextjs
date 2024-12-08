'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server"
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export default async function createPostAction(formData: FormData) {
    await connectDB()
    const user = await currentUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if (!postInput) {
        throw new Error("Post input is required");
    }

    //define the user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || ""
    }

    // let uploadResponse;
    try {
        await connectDB()

        if (image.size > 0) {
            //1. Upload the image if there is one - Cloudinary
            // console.log(image)
            // uploadResponse = await cloudinary.uploader.upload(image)
            //2. Create post in database with image
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                // imageUrl: uploadResponse.secure_url
            }
            await Post.create(body);
        } else {
            //1.Create post in database without image
            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput
            }

            await Post.create(body)
        }
    } catch (error: any) {
        throw new Error("Failed to create new post: ", error)
    }

    //revalidatePath '/' - home page 
}