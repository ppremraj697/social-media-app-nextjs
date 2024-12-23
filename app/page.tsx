import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import Widget from "@/components/Widget";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
// import { SignedIn } from "@clerk/nextjs";
import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Briefcase, HomeIcon, MessagesSquare, SearchIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
export const revalidate = 0;

export default async function Home() {

  await connectDB();
  const posts = await Post.getAllPosts();


  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5 relative">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts} />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>

        <PostFeed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2">
        <Widget />
      </section>

      <div className="flex items-center justify-between px-6 py-1 fixed bottom-0 left-0 mt-2 z-10 bg-gray-100 w-full">
        <Link href="/" className="icon" >
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>
        <Link href="/" className="icon md:flex" >
          <UsersIcon className="h-5" />
          <p>Network</p>
        </Link>
        <Link href="/" className="icon md:flex" >
          <Briefcase className="h-5" />
          <p>Job</p>
        </Link>
        <Link href="/" className="icon" >
          <MessagesSquare className="h-5" />
          <p>Messaging</p>
        </Link>

        <SignedIn >
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant="secondary">
            <SignInButton />
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}
