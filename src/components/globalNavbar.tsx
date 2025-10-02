"use client"

import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu as MenuIcon } from "lucide-react"

export default function GlobalNavbar() {
  return (
    <div className="flex w-full items-center justify-between px-4 py-2 border-b bg-white">
      {/* โลโก้ */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
            <Image 
            src="/favicon.ico" 
            alt="Logo" 
            width={32} 
            height={32} 
            />
        </Link>
        </div>

      {/* เมนู Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-4">
                <MenuIcon className="w-10 h-10" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="me-2 ">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/history" >History</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
