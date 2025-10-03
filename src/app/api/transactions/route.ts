import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const formInput = await req.json()
    const { amount, type, description, category, date } = formInput
    // console.log("รับข้อมูล:", formInput)
 
    const created_at = new Date(date + ":00").toISOString() // แปลง date จากเวลาไทย เป็น UTC ก่อนเก็บลง supabase timestampz with time zone เพื่อจะแปลงกลับมาเป็นเวลาที่ถุกต้อง

    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string }
    const uid = decoded.uid

    const { data, error } = await supabase.from("transactions").insert({
      uid,
      amount,
      type,
      description,
      category,
      created_at, // ✅ ชื่อฟิลด์ตรงกับตาราง
    }).select()

    if (error) throw error

    return NextResponse.json({ message: "ok", data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "invalid body" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string }
    const uid = decoded.uid

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("uid", uid)
      .order("created_at", { ascending: false })
    if (error) throw error

    return NextResponse.json({ data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "fetch failed" }, { status: 400 })
  }
}
