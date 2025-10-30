"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Menu } from "lucide-react"
import AlertNotification, { AlertType } from "./ui/alertNotification"

export default function GlobalNavbar() {
  const [alert, setAlert] = useState<AlertType | null>(null)
  const [loading, setLoading] = useState(false)
  const clearAlert = useCallback(() => setAlert(null), [])
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true) // เริ่ม loading
    try {
      const res = await fetch("/api/auth/logout")
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
        router.push('/login')
    } catch (err) {
      console.log((err as Error).message)
      setAlert({
        alertType: "error",
        head: "ข้อผิดพลาด",
        description: (err as Error).message,
        clear: clearAlert,
      })
    } finally {
      setLoading(false) // จบ loading
    }
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between px-6 py-3 border-b bg-white">
        {/* โลโก้ */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
          </Link>
        </div>

        {/* เมนู Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="me-5 ">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/" className="w-full">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/history" className="w-full">History</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/analyze" className="w-full">Analyze</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/qr" className="w-full">QR Generater</Link>
            </DropdownMenuItem>
            <div className="border-b mt-5"/>
            <DropdownMenuItem
              className={`cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
              onClick={handleLogout}
            >
              {loading ? "กำลังออก..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {alert && <AlertNotification {...alert} />}
    </div>
  )
}
