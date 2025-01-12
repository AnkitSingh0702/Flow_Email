"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FlowEditor } from "../components/flow-editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
  
    if (status === "loading") {
      return <div>Loading...</div>
    }
  
    if (!session) {
      router.push("/signin")
      return null
    }
  
    const userInitials = session.user?.name
      ? session.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "U"
  
    return (
      <main className="h-screen bg-background">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Email Sequence Builder</h1>
            <div className="flex items-center gap-4">
              <Button className="bg-primary text-primary-foreground">
                Save & Schedule
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="text-sm font-medium">{session.user?.name}</div>
                    <div className="text-xs text-muted-foreground">{session.user?.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/signin" })}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <FlowEditor />
        </div>
      </main>
    )
  }
  