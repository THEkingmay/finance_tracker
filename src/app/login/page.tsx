"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // 🔹 state สำหรับแสดง error
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("") // ล้าง error ก่อน submit

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"

    try {
    // throw new Error("test")
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Something went wrong")

      router.push('/')

      // 🔹 ล้าง input หลัง submit สำเร็จ
      setEmail("")
      setPassword("")
    } catch (err) {
      setError((err as Error).message || "Failed") // 🔹 แสดง error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              className="mt-2"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              className="mt-2"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </Button>
        </form>

        {/* สลับ Login/Register */}
        <div className="text-sm mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        {/* 🔹 แสดง Error message */}
        {error && (
          <div className="mt-4 text-center text-red-500 font-medium bg-red-100 p-2 rounded border border-red-500 ">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
