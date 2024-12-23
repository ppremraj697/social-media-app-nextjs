import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Briefcase, HomeIcon, MessagesSquare, SearchIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

const Header = () => {
    return (
        <div className="flex items-center p-2 max-w-6xl mx-auto">
            <Image
                className="rounded-lg"
                src="https://links.papareact.com/b3z"
                width={40}
                height={40}
                alt="logo"
            />

            <div className="flex-1">
                <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
                    <SearchIcon className="h-4 text-gray-600" />
                    <input type="text" placeholder="Search" className="bg-transparent flex-1 outline-none" />
                </form>
            </div>
        </div>
    )
}

export default Header
